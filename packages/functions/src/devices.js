
import { ApiHandler, useJsonBody, usePathParam } from "sst/node/api";
import {
	IoTClient,
	CreateThingCommand,
	CreateKeysAndCertificateCommand,
	AttachPolicyCommand,
	AttachThingPrincipalCommand,
	ListThingsCommand,
	DescribeThingCommand,
	DescribeEndpointCommand,
} from "@aws-sdk/client-iot";
import {
	IoTDataPlaneClient,
	UpdateThingShadowCommand
} from "@aws-sdk/client-iot-data-plane";
import { getAwsRootCert } from '../../core/src/aws-root-cert';
import { TimestreamQueryClient, QueryCommand } from "@aws-sdk/client-timestream-query";

const client = new IoTClient({});
const dataPlaneClient = new IoTDataPlaneClient({});
const tsClient = new TimestreamQueryClient();


const getUserId = (event) => {
	return event.requestContext.authorizer.iam.cognitoIdentity.identityId;
}

const isThisAThingOfMine = async (thingName, event) => {
	const describeThingCmd = new DescribeThingCommand({
		thingName
	});
	const thing = await client.send(describeThingCmd);
	return (thing && (thing.attributes.owner == getUserId(event)))
}

const getIotEndPoint = async () => {
	const descEndPointCommand = new DescribeEndpointCommand({
		endpointType: "iot:Data-ATS"
	});
	const response = await client.send(descEndPointCommand);
	return response.endpointAddress;
}

export const create = ApiHandler(async (event) => {
	const thingName = useJsonBody().thingName;

	const createThingCmd = new CreateThingCommand({
		thingName: thingName || 'shouldnothappen',
		thingTypeName: 'iotStartType',
		attributePayload: {
			attributes: {
				"owner": getUserId(event)
			}
		}
	});
	const createThingResponse = await client.send(createThingCmd);

	const thing = { thingName, endpoint: await getIotEndPoint(), certPem: "", publicKey: "", privateKey: "", awsRootPem: getAwsRootCert() };

	const keysAndCertsCommand = new CreateKeysAndCertificateCommand({
		setAsActive: true
	});

	const createKeysAndCertsResponse = await client.send(keysAndCertsCommand);
	thing.certPem = createKeysAndCertsResponse.certificatePem;
	if (createKeysAndCertsResponse.keyPair) {
		thing.publicKey = createKeysAndCertsResponse.keyPair.PublicKey;
		thing.privateKey = createKeysAndCertsResponse.keyPair.PrivateKey;
	}

	const attachPolicyCommand = new AttachPolicyCommand({
		policyName: 'iotStarterApp-' + process.env.STAGE,
		target: createKeysAndCertsResponse.certificateArn
	});

	await client.send(attachPolicyCommand);

	const attachPrincipleCmd = new AttachThingPrincipalCommand({
		thingName: thing.thingName,
		principal: createKeysAndCertsResponse.certificateArn
	});

	await client.send(attachPrincipleCmd);

	return {
		status: 200,
		body: thing
	};
});

export const list = ApiHandler(async (event) => {

	const listThingsCmd = new ListThingsCommand({
		attributeName: "owner",
		attributeValue: getUserId(event),
		maxResults: 100
	});

	const things = await client.send(listThingsCmd);
	const theThings = things.things;
	//stripping out arns, clients should not need these
	theThings.forEach((thing) => { delete thing.thingArn });
	return {
		status: 200,
		body: theThings
	}
});

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

// inspired by https://github.com/aws-samples/amazon-timestream-simple-visualizer/blob/main/src/api/timestream.js
const cleanName = (name) => name.replace('-', '_');

const convertValue = (type, value) => {
  switch (type) {
    case 'varchar':
      return `'${value}'`
    default:
      return value
  }
}

const query = async (
	db,
	table,
	{ interval, measures, groupInterval, groupAggregation, filters }
) => {
	const conditions = (filters || []).filter(
		(q) => q.dimention && q.operator && q.value
	)

	const q = `
  SELECT 
    ${groupInterval ? `bin(time, ${groupInterval}) as time` : 'time'},
    ${measures
			.map(
				(p) =>
					`${groupInterval ? groupAggregation : ''}(CASE WHEN measure_name = '${p.name
					}' THEN measure_value::${p.type} ELSE NULL END) as ${cleanName(
						p.name
					)}`
			)
			.join(', ')}
FROM "${db}"."${table}"
WHERE time >= ago(${interval})
AND measure_name IN (${measures.map((p) => `'${p.name}'`).join(',')})
${conditions.length > 0 ? 'AND' : ''}
${conditions
			.map(
				(f) =>
					`${f.dimention.name} ${f.operator} ${convertValue(
						f.dimention.type,
						f.value
					)}`
			)
			.join(' AND ')}
${groupInterval ? `GROUP BY bin(time, ${groupInterval})` : ''}
ORDER BY time DESC
`

	return {
		query: q,
		result: await tsClient.send(new QueryCommand({ QueryString: q })),
	}
}


export const metrics = ApiHandler(async (event) => {
	const thingName = usePathParam("name");


	if (!isThisAThingOfMine(thingName, event)) {
		return {
			status: 404,
			body: { message: "no device or metrics found." }
		}
	}
	const metrics = [];
	// for (let index = 0; index < 1000; index++) {
	// 	metrics.push({ ts: Date.now() + index, temp: getRandomArbitrary(10, 20), hum: getRandomArbitrary(50, 90), press: getRandomArbitrary(900, 1200) });
	// }
	const db = process.env.METRICS_DB;
	

	const response = await query(db, 'metrics', {interval: '1d',measures: [{name: "hum", type: "bigint"}, {name: 'pressure', type: "bigint"}, {name: "temp", type: "double"}], groupInterval: '30s', groupAggregation:"AVG"})
	const theData = response.result.Rows.map((p) => {
		return {
			ts: p.Data[0].ScalarValue,
			hum: parseFloat(p.Data[1].ScalarValue),
			pressure: parseFloat(p.Data[2].ScalarValue),
			temp: parseFloat(p.Data[3].ScalarValue)
		}
	});
	
	return {
		status: 200,
		body: theData
	}
});


export const updateShadow = ApiHandler(async (event) => {
	const thingName = usePathParam("name");
	const data = useJsonBody();


	if (!isThisAThingOfMine(thingName, event)) {
		return {
			status: 404,
			body: { message: "no device or metrics found." }
		}
	}

	const updateThingShadowCmd = new UpdateThingShadowCommand({
		thingName,
		payload: JSON.stringify({ "state": { "reported": { "color": data.color } } }),
	});

	await dataPlaneClient.send(updateThingShadowCmd);

	return {
		status: 200,
	}
});

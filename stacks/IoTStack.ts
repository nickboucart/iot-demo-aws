import { aws_iot, aws_iam } from "aws-cdk-lib";
import { use } from "sst/constructs";
import { StorageStack } from "./StorageStack";


export function IoTStack({ stack, app }) {

	const db = use(StorageStack);

	const iotPolicy = new aws_iot.CfnPolicy(stack, 'IoTThingPolicy', {
		policyName: 'iotStarterApp-' + app.stage,
		policyDocument: {
			"Version": "2012-10-17",
			"Statement": [
				{
					"Condition": {
						"Bool": {
							"iot:Connection.Thing.IsAttached": [
								"true"
							]
						}
					},
					"Effect": "Allow",
					"Action": "iot:Connect",
					"Resource": "*"
				},
				{
					"Condition": {
						"Bool": {
							"iot:Connection.Thing.IsAttached": [
								"true"
							]
						}
					},
					"Effect": "Allow",
					"Action": [
						"iot:Publish",
						"iot:Subscribe",
						"iot:Receive"
					],
					"Resource": "*"
				}
			]
		}
	});


	const iotRuleRole = new aws_iam.Role(stack, "RoleIoTToTimestream", {
		description: "role that allows the iot rule engine to put data in our metrics db",
		roleName: "io2timestreamrole",
		assumedBy: new aws_iam.ServicePrincipal("iot.amazonaws.com"),
	});

iotRuleRole.attachInlinePolicy(new aws_iam.Policy(stack, "PolicyForIoToTimestream", {
	policyName: 'PolicyForIoToTimestream',
	statements: [
		new aws_iam.PolicyStatement({
			resources: ['*'],
			actions: ['timestream:DescribeEndpoints', 'timestream:WriteRecords'],
		}),
	]
}));


	const actionConfig = new aws_iot.CfnTopicRule(stack, 'iotstartertopic',
		{
			topicRulePayload: {
				sql: "SELECT * FROM 'metrics'",
				actions: [{
					timestream: {
						roleArn: iotRuleRole.roleArn,
						tableName: 'metrics',
						databaseName: "metricsdb" + app.stage,
						dimensions: [{
							name: "device_name",
							value: "${clientId()}"
						},]
					}
				}],
			}
		});

	// Show the URLs in the output
	stack.addOutputs({
		ThingPolicyName: iotPolicy.policyName,
	});

	return { iotPolicy, };
}



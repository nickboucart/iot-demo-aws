import { StackContext, Api, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";


export function APIStack({ stack }: StackContext) {
  const { db } = use(StorageStack);
  const api = new Api(stack, "api", {
    defaults: {
      authorizer: 'iam',
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "POST /devices": {
        function: {
          handler: "packages/functions/src/devices.create",
          timeout: 30,
          environment: { STAGE: stack.stage },
          permissions: ["iot:CreateThing", "iot:CreateKeysAndCertificate", "iot:AttachThingPrincipal", "iot:AttachPolicy", "iot:DescribeEndpoint"]
        }
      },
      "GET /devices": {
        function: {
          handler: "packages/functions/src/devices.list",
          timeout: 3,
          permissions: ["iot:ListThings"]
        }
      },
      "GET /devices/{name}/metrics": {
        function: {
          handler: "packages/functions/src/devices.metrics",
          timeout: 3,
          permissions: ["iot:DescribeThing", "timestream:Select", "timestream:DescribeEndpoints" ],
          environment: {
            METRICS_DB: db.databaseName
          },

        }
      },
      "POST /devices/{name}/shadow": {
        function: {
          handler: "packages/functions/src/devices.updateShadow",
          timeout: 3,
          permissions: ["iot:DescribeThing", "iot:UpdateThingShadow"]
        }
      },

    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}

import { SSTConfig } from "sst";
import { APIStack } from "./stacks/APIStack";
import { AuthStack } from "./stacks/AuthStack";
import { WebAppStack } from "./stacks/WebStack";
import { IoTStack } from "./stacks/IoTStack";
import { StorageStack } from "./stacks/StorageStack";


export default {
  config(_input) {
    return {
      name: "iot-starter-app",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(APIStack).stack(AuthStack).stack(WebAppStack).stack(IoTStack);
  },
} satisfies SSTConfig;

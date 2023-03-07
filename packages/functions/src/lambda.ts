import { ApiHandler } from "sst/node/api";
import { Time } from "@iot-starter-app/core/time";

export const handler = ApiHandler(async (event) => {
  return {
    body: `Hello world. The time is ${Time.now()}`, meta: event,
  };
});

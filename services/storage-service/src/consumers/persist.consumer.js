import { consumeEvent } from "../../../event-bus/src/consumer.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { storeToMongoDB } from "../adapters/mongodb.adapter.js";
import { storeToRedis } from "../adapters/redis.adapter.js";

export const consumePersistMemory = asyncHandler(async () => {
  await consumeEvent(EVENTS.MEMORY_SCORED, async (data) => {
    console.log("Received scored memory:", data);

    if (data.type === "long-term") {
      if (data.score < 0.9) {
        console.log("New long-term memory detected. Storing in MongoDB.");
        await storeToMongoDB(data);
      } else {
        console.log("Similar long-term memory already exists. Skipping.");
      }
    } else if (data.type === "short-term") {
      if (data.score > 0.15) {
        console.log("New short-term context detected. Storing in Redis.");
        await storeToRedis(data);
      } else {
        console.log("Similar short-term context found. Skipping.");
      }
    }
  });
});

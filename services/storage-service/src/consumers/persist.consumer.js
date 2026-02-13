import { consumeEvent } from "../../../event-bus/src/consumer.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { storeToMongoDB } from "../adapters/mongodb.adapter.js";
import { storeToRedis } from "../adapters/redis.adapter.js";
import { MemoryModel } from "../../../../shared/models/memory.model.js";
import { publishMemoryId } from "../adapters/publisher.adapter.js";

export const consumePersistMemory = asyncHandler(async () => {
  let memoryId = null;
  await consumeEvent(EVENTS.MEMORY_SCORED, async (data) => {
    console.log("Received scored memory:", data);

    if (data.type === "long-term") {
      if (data.score < 0.8) {
        console.log("New long-term memory detected. Storing in MongoDB.");
        const result = await storeToMongoDB(data);
        memoryId = result?._id;
      } else {
        memoryId = data?.memoryId;
        console.log("Similar long-term memory already exists. Skipping.");

        await MemoryModel.updateOne(
          {
            _id: data.memoryId,
          },
          {
            $set: {
              lastSeenAt: new Date(),
            },
            $inc: { frequency: 1 },
          },
        );
      }
    } else if (data.type === "short-term") {
      if (data.score > 0.6) {
        console.log("New short-term context detected. Storing in Redis.");
        const key = await storeToRedis(data);
        memoryId = key;
      } else {
        console.log("Similar short-term context found. Skipping.");
      }
    }

    const memory = {
      memoryId,
      correlationId: data?.correlationId,
    };

    await publishMemoryId(memory);
  });
});

import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { MessageBridge } from "../../../../shared/utilities/MessageBridge.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import { publishMemoryIngested } from "../adapters/event.publisher.js";
import { getType } from "../adapters/llm.adapter.js";

export const ingestMemory = asyncHandler(async (userId, content) => {
  const correlationId = MessageBridge.createCorrelationId();
  let result = await getType(content);

  const memory = {
    userId,
    content,
    correlationId,
    type: result.type,
    createdAt: new Date(),
  };

  console.log(memory);

  await publishMemoryIngested(EVENTS.MEMORY_INGESTED, memory);

  const responseData = await MessageBridge.waitForResponse(correlationId);

  return {
    message: "Memory processed successfully",
    memoryId: responseData.memoryId,
    type: result.type,
  };
});

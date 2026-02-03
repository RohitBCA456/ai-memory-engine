import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import { publishMemoryIngested } from "../adapters/event.publisher.js";
import { getType } from "../adapters/llm.adapter.js";

export const ingestMemory = asyncHandler(async (userId, content) => {

  let result = await getType(content);
  
  const memory = {
    userId,
    content,
    type: result.type,
    createdAt: new Date(),
  };

  console.log(memory);

  await publishMemoryIngested(EVENTS.MEMORY_INGESTED, memory);

  return {
    message: "Memory accepted for processing",
    memory,
  };
});

import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import { publishEvent } from "../../../event-bus/src/producer.js";

export const publishMemoryId = asyncHandler(async (memory) => {
  await publishEvent(EVENTS.MEMORY_PERSISTED, {
    memoryId: memory.memoryId,
    correlationId: memory.correlationId,
  });
});

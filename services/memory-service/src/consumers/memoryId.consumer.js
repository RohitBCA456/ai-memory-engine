import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { consumeEvent } from "../../../event-bus/src/consumer.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import { MessageBridge } from "../../../../shared/utilities/MessageBridge.js";

export const consumeMemoryId = asyncHandler(async () => {
  await consumeEvent(EVENTS.MEMORY_PERSISTED, (data) => {

    MessageBridge.resolveResponse(data.correlationId, {
      memoryId: data.memoryId,
    });
  });
});

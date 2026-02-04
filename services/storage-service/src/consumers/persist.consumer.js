import { consumeEvent } from "../../../event-bus/src/consumer.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";

export const consumePersistMemory = asyncHandler(async () => {
  await consumeEvent(EVENTS.MEMORY_SCORED, async (data) => {
    console.log("Received scored memory:", data);
  });
});

import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { consumeEvent } from "../../../event-bus/src/consumer.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import {
  generateScoreForLongTerm,
  generateScoreForShortTerm,
} from "../services/scoring.service.js";

export const consumeMemoryEmbedding = asyncHandler(async () => {
  await consumeEvent(EVENTS.EMBEDDING_CREATED, async (data) => {
    if (data && data.embedding) {
      if (data.type === "short-term") {
        await generateScoreForShortTerm(data.userId, data.embedding);
      } else {
        await generateScoreForLongTerm(data.userId, data.embedding);
      }
    } else {
      console.log("Fields are missing.");
    }
  });
});

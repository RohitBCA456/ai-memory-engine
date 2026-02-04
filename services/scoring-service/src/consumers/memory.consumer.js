import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { consumeEvent } from "../../../event-bus/src/consumer.js";
import { EVENTS } from "../../../event-bus/src/event.js";
import {
  generateScoreForLongTerm,
  generateScoreForShortTerm,
} from "../services/scoring.service.js";
import { publishScoreGenerated } from "../adapters/event.publisher.js";

export const consumeMemoryEmbedding = asyncHandler(async () => {

  await consumeEvent(EVENTS.EMBEDDING_CREATED, async (data) => {

    if (data && data.embedding) {
      
      if (data.type === "short-term") {
        const score = await generateScoreForShortTerm(
          data.userId,
          data.embedding,
        );

        const memory = {
          ...data,
          score,
        };

        await publishScoreGenerated(EVENTS.MEMORY_SCORED, memory);
      } else {
        const score = await generateScoreForLongTerm(
          data.userId,
          data.embedding,
        );

        const memory = {
          ...data,
          score,
        };

        await publishScoreGenerated(EVENTS.MEMORY_SCORED, memory);
      }
    } else {
      console.log("Fields are missing.");
    }
  });
});

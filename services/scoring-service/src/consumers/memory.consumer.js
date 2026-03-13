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
        const score = await generateScoreForShortTerm(data.userId, data.content);


        const memory = {
          ...data,
          scoreData: {
            memoryId: score.memoryId,
            score: score.score,
          },
        };

        await publishScoreGenerated(EVENTS.MEMORY_SCORED, memory);
      } else {
        const score = await generateScoreForLongTerm(data.userId, data.content);


        const memory = {
          ...data,
          scoreData: {
            score: score.score,
            memoryId: score?.memoryId,
            frequency: score?.frequency,
          },
        };

        await publishScoreGenerated(EVENTS.MEMORY_SCORED, memory);
      }
    } else {
      return "Fields are missing";
    }
  });
});

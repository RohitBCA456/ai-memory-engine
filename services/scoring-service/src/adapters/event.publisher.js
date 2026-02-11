import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { publishEvent } from "../../../event-bus/src/producer.js";

export const publishScoreGenerated = asyncHandler(async (event, memory) => {
  console.log("Publishing scored memory event:", { event, memory });

  await publishEvent(event, {
    userId: memory.userId,
    content: memory.content,
    type: memory.type,
    embedding: memory.embedding,
    score: memory.scoreData.score,
    memoryId: memory.scoreData?.memoryId,
    frequency: memory.scoreData?.frequency,
  });
});

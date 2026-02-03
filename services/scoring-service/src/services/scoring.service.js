import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { findSimilarLongTermMemory } from "../../../../shared/utilities/longTermMemorySimilarity.js";
import { findSimilarShortTerm } from "../../../../shared/utilities/shortTermMemorySimilarity.js";

export const generateScoreForLongTerm = asyncHandler(
  async (userId, embedding) => {
    const result = await findSimilarLongTermMemory(userId, embedding);
    return result[0].score;
  },
);

export const generateScoreForShortTerm = asyncHandler(
  async (userId, embedding) => {
    const result = await findSimilarShortTerm(userId, embedding);
    const topMatch = result[0];

    const distance = parseFloat(topMatch.value.score);
    return distance;
  },
);

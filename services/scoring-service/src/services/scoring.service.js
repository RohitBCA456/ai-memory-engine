import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { findSimilarLongTermMemory } from "../../../../shared/utilities/longTermMemorySimilarity.js";
import { findSimilarShortTerm } from "../../../../shared/utilities/shortTermMemorySimilarity.js";

export const generateScoreForLongTerm = asyncHandler(
  async (userId, embedding) => {
    const result = await findSimilarLongTermMemory(userId, embedding);

    if (!result || result.length === 0) {
      return {
        score: 0,
        memoryId: null,
        frequency: 0,
      };
    }

    const matched = result[0];

    console.log("Similar long-term memory found:", matched);

    return {
      score: matched.score,
      memoryId: matched._id,
      frequency: matched.frequency,
    };
  }
);


export const generateScoreForShortTerm = asyncHandler(
  async (userId, embedding) => {
    const result = await findSimilarShortTerm(userId, embedding);
    return result.length > 0 ? parseFloat(result[0].value.score) : 1.0;
  },
);

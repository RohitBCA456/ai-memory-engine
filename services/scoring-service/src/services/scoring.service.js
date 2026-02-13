import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { findSimilarLongTermMemory } from "../../../../shared/utilities/longTermMemorySimilarity.js";
import { findSimilarShortTerm } from "../../../../shared/utilities/shortTermMemorySimilarity.js";

export const generateScoreForLongTerm = asyncHandler(async (userId, text) => {
  const result = await findSimilarLongTermMemory(userId, text);

  if (!result || result.length === 0) {
    return {
      score: 0,
    };
  }

  const matched = result[0];

  console.log("Similar long-term memory found:", matched);

  return {
    score: matched.score,
    memoryId: matched._id,
    frequency: matched.frequency,
  };
});

export const generateScoreForShortTerm = asyncHandler(async (userId, text) => {
  
  const result = await findSimilarShortTerm(userId, text);

  if (!result || result.length === 0) {
    return {
      score: 1.0,
      memoryId: null,
    };
  }

  const matched = result[0];

  return {
    score: matched.score,
    memoryId: matched.memoryId,
  };
});

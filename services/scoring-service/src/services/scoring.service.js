import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { findSimilarLongTermMemory } from "../../../../shared/utilities/longTermMemorySimilarity.js";
import { findSimilarShortTerm } from "../../../../shared/utilities/shortTermMemorySimilarity.js";

export const generateScoreForLongTerm = asyncHandler(async (userId, embedding) => {
  const result = await findSimilarLongTermMemory(userId, embedding);
  console.log("Similar long-term memories found:", result[0]);
  return result.length > 0 ? result[0].score : 0; 
});

export const generateScoreForShortTerm = asyncHandler(async (userId, embedding) => {
  const result = await findSimilarShortTerm(userId, embedding);
  return result.length > 0 ? parseFloat(result[0].value.score) : 1.0; 
});
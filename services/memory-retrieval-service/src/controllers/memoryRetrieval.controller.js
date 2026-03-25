import mongoose from "mongoose";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { retrieveFromMongoDB } from "../service/retrievalFromMongoDB.service.js";
import { retrieveFromRedis } from "../service/retrievalFromRedis.service.js";
import { findSimilarLongTermMemory } from "../../../../shared/utilities/longTermMemorySimilarity.js";
import { findSimilarShortTerm } from "../../../../shared/utilities/shortTermMemorySimilarity.js";

export const memoryRetrieval = asyncHandler(async (req, res) => {
  const { memoryId } = req.params;
  const { content: queryText, userId } = req.body; 

  if (queryText) {
    if (!userId) {
      return res.status(400).json({ message: "UserId is required for similarity search" });
    }

    const stResults = await findSimilarShortTerm(userId, queryText);
    
    if (stResults.length > 0 && stResults[0].score < 0.4) {
      return res.status(200).json({
        message: "Similar content found in Short-Term Memory",
        source: "Redis",
        data: stResults[0]
      });
    }

    const ltResults = await findSimilarLongTermMemory(userId, queryText);

    if (ltResults.length > 0) {
      return res.status(200).json({
        message: "Similar content found in Long-Term Memory",
        source: "MongoDB",
        data: ltResults[0]
      });
    }

    return res.status(404).json({ message: "No similar data found" });
  }

  if (!memoryId) {
    return res.status(400).json({ message: "MemoryId or Content is Missing" });
  }

  const isValid = mongoose.Types.ObjectId.isValid(memoryId);

  if (isValid) {
    const data = await retrieveFromMongoDB(memoryId);
    return res.status(200).json({ message: "content found", content: data });
  } else {
    const data = await retrieveFromRedis(memoryId);
    return res.status(200).json({ message: "content found", content: data });
  }
});
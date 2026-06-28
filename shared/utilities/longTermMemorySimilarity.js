import { MemoryModel } from "../models/memory.model.js";
import { getEmbedding } from "./llm.adapter.js";

export async function findSimilarLongTermMemory(userId, text, appId) {
  const queryVector = await getEmbedding(text, true);

  const cleanUserId = String(userId).trim();
  const cleanAppId = String(appId).trim();

  return await MemoryModel.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryVector,
        numCandidates: 50,
        limit: 1,
        filter: { 
          userId: cleanUserId, 
          appId: cleanAppId 
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        metadata: 1,
        score: { $meta: "vectorSearchScore" },
        frequency: 1,
      },
    },
  ]);
}
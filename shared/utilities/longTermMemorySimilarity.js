import { MemoryModel } from "../models/memory.model.js";
import { getEmbedding } from "../../services/embedding-service/src/adapters/llm.adapter.js";

export async function findSimilarLongTermMemory(userId, text) {

  const queryVector = await getEmbedding(text, true);

  return await MemoryModel.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryVector,
        numCandidates: 50,
        limit: 1,
        filter: { userId: userId },
      },
    },

    {
      $project: {
        _id: 1,
        score: { $meta: "vectorSearchScore" },
        frequency: 1,
      },
    },
  ]);
}

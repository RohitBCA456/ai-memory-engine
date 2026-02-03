import { MemoryModel } from "../models/memory.model.js";

export async function findSimilarLongTermMemory(userId, inputVector) {
  return await MemoryModel.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: inputVector,
        numCandidates: 50,
        limit: 1,
        filter: { userId: userId },
      },
    },

    {
      $project: {
        score: { $meta: "vectorSearchScore" },
        frequency: 1,
      },
    },
  ]);
}

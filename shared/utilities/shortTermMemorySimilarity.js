import { redisClient } from "../connectors/redis.connector.js";
import { getEmbedding } from "./llm.adapter.js";

export async function findSimilarShortTerm(userId, appId, text) {
  try {
    const queryVector = await getEmbedding(text, true);
    const vectorBuffer = Buffer.from(new Float32Array(queryVector).buffer);

    const query = `(@appId:{${appId}} @userId:{${userId}})=>[KNN 1 @embedding $vec AS vector_dist]`;

    const result = await redisClient.ft.search("memory_index", query, {
      PARAMS: { vec: vectorBuffer },
      SORTBY: "vector_dist",
      DIALECT: 2,
      RETURN: ["content", "metadata", "vector_dist"],
    });

    return result.documents.map((doc) => ({
      memoryId: doc.id,
      content: doc.value.content,
      metadata: doc.value.metadata,
      score: parseFloat(doc.value.vector_dist) || 0,
    }));
  } catch (error) {
    if (
      error.message.includes("Unknown index") ||
      error.message.includes("No such index")
    ) {
      return [];
    }
    throw error;
  }
}

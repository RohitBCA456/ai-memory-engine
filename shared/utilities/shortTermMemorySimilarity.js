import { redisClient } from "../connectors/redis.connector.js";
import { getEmbedding } from "../../services/embedding-service/src/adapters/llm.adapter.js";

export async function findSimilarShortTerm(userId, text) {
  try {

    const queryVector = await getEmbedding(text, true);
    const vectorBuffer = Buffer.from(new Float32Array(queryVector).buffer);

    const query = `(@userId:{${userId}})=>[KNN 1 @embedding $vec AS vector_dist]`;

    const result = await redisClient.ft.search("memory_index", query, {
      PARAMS: { vec: vectorBuffer },
      SORTBY: "vector_dist",
      DIALECT: 2,
      RETURN: ["content", "vector_dist"],
    });

    return result.documents.map((doc) => ({
      content: doc.value.content,
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

import { redisClient } from "../connectors/redis.connector.js";

export async function findSimilarShortTerm(userId, inputVector) {
  try {
    const vectorBuffer = Buffer.from(new Float32Array(inputVector).buffer);
    
    const query = `(@userId:{${userId}})=>[KNN 1 @embedding $vec AS search_score]`;

    const result = await redisClient.ft.search("memory_index", query, {
      PARAMS: { vec: vectorBuffer },
      SORTBY: "search_score",
      DIALECT: 2,
      RETURN: ["content", "search_score"],
    });

    return result.documents;
  } catch (error) {
    if (error.message.includes("Unknown index")) {
      console.warn("Redis index not found. Ensure FT.CREATE was run in terminal.");
      return [];
    }
    throw error;
  }
}
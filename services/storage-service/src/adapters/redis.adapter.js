import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { redisClient } from "../../../../shared/connectors/redis.connector.js";

export const storeToRedis = asyncHandler(async (data) => {
  const vectorBuffer = Buffer.from(new Float32Array(data.embedding).buffer);

  await redisClient.hSet(`mem:${data.userId}:${Date.now()}`, {
    content: data.content,
    type: data.type,
    embedding: vectorBuffer, 
    score: data.score.toString(), 
    userId: data.userId,
    createdAt: Date.now().toString()
  });

  await redisClient.expire(`mem:${data.userId}:${Date.now()}`, 60 * 60 * 24);
});
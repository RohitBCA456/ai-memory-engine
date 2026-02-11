import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { redisClient } from "../../../../shared/connectors/redis.connector.js";

export const storeToRedis = asyncHandler(async (data) => {
  const vectorBuffer = Buffer.from(new Float32Array(data.embedding).buffer);

  const key = `mem:${data.userId}:${Date.now()}`;

  await redisClient.hSet(key, {
    content: data.content,
    type: data.type,
    embedding: vectorBuffer,
    score: (Number(data.score) || 0).toString(),
    userId: data.userId,
    createdAt: Date.now().toString(),
  });

  await redisClient.expire(key, 60 * 60 * 24);

  return key;
});

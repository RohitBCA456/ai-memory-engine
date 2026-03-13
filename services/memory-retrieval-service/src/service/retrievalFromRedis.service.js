import { redisClient } from "../../../../shared/connectors/redis.connector.js";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";

export const retrieveFromRedis = asyncHandler(async (key) => {
  const document = await redisClient.hGetAll(key);

  if (!document) {
    return null;
  }

  return document.content;
});

import { redisClient } from "../../../../shared/connectors/redis.connector.js";

export async function redisMemoryDeletion(key) {
  const deletion = await redisClient.del(key);

  return deletion;
}

import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const redisClient = createClient({
  url: 'redis://host.docker.internal:6379',
});


redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function connectToRedis() {
  await redisClient.connect();
  console.log("Connected to Redis");
}

import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function connectToRedis() {
  await redisClient.connect();
  console.log("Connected to Redis");
}

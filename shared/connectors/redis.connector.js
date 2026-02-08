import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function connectToRedis() {
  await redisClient.connect();
  console.log("Connected to Redis");
}

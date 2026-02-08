import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToMongoDB } from "../../shared/connectors/mongodb.connector.js";
import { connectToRedis } from "../../shared/connectors/redis.connector.js";
import { consumePersistMemory } from "./src/consumers/persist.consumer.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

await connectToMongoDB();
await connectToRedis();

await consumePersistMemory();

app.listen(process.env.PORT, () => {
  console.log(`Storage Service is running on port ${process.env.PORT}`);
});

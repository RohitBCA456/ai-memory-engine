import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToMongoDB } from "./src/connectors/mongodb.connector.js";
import mongoose from "mongoose";
import { getMemoryModel } from "../../shared/models/memory.model.js";
import { connectToRedis } from "./src/connectors/redis.connector.js";

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

export const MemoryModel = await getMemoryModel(mongoose);

app.listen(process.env.PORT, () => {
  console.log(`Storage Service is running on port ${process.env.PORT}`);
});

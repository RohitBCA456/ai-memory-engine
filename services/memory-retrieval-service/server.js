import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToMongoDB } from "../../shared/connectors/mongodb.connector.js";
import { connectToRedis } from "../../shared/connectors/redis.connector.js";
import { retrievalRouter } from "./src/routers/memoryRetrieval.router.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/", retrievalRouter);

await connectToMongoDB();
await connectToRedis();

app.listen(process.env.PORT, () => {
  console.log(
    `Memory Retrieval service is running on Port: ${process.env.PORT}`,
  );
});

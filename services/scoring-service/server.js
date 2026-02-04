import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { consumeMemoryEmbedding } from "./src/consumers/memory.consumer.js";

dotenv.config();

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

await consumeMemoryEmbedding();

app.listen(process.env.PORT, () => {
  console.log(`Scoring Service is running at port : ${process.env.PORT}`);
});

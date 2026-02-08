import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { consumeMemoryIngest } from "./src/consumers/embedding.consumer.js";

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

await consumeMemoryIngest();

app.listen(process.env.PORT, () => {
  console.log(`Embedding Service is running on port : ${process.env.PORT}`);
});

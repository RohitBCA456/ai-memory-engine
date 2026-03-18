import express from "express";
import { memoryRouter } from "./src/routes/memory.routes.js";
import dotenv from "dotenv";
import cors from "cors";
import { consumeMemoryId } from "./src/consumers/memoryId.consumer.js";
import { ApiResponse } from "../../shared/utilities/ApiResponse.js";

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

await consumeMemoryId();

app.use("/", memoryRouter);

app.get("/", (req, res) => {
  const response = new ApiResponse(200, "memory ingestion is up!");

  res.json(response);
});

app.listen(process.env.PORT, () => {
  console.log(`Memory Service is running on port: ${process.env.PORT}`);
});

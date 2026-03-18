import express from "express";
import cors from "cors";
import { ragRouter } from "./src/routers/ragRouter.js";
import dotenv from "dotenv";
import { ApiResponse } from "../../shared/utilities/ApiResponse.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", ragRouter);

app.get("/", (req, res) => {
  const response = new ApiResponse(200, "rag is up!");

  res.json(response);
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`RAG Service live on port ${PORT}`));

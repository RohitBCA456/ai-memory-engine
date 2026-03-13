import express from "express";
import cors from "cors";
import { ragRouter } from "./src/routers/ragRouter.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", ragRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`RAG Service live on port ${PORT}`));

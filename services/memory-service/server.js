import express from "express";
import { memeoryRouter } from "./src/routes/memory.routes.js";
import dotenv from "dotenv";
import cors from "cors";

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

app.use("/", memeoryRouter);

app.listen(process.env.PORT, () => {
  console.log(`server running on port: ${process.env.PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { userRouter } from "./src/routers/user.router.js";
import { connectToRedis } from "../../shared/connectors/redis.connector.js";
import { connectToMongoDB } from "../../shared/connectors/mongodb.connector.js";
import { ApiResponse } from "../../shared/utilities/ApiResponse.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/", userRouter);

await connectToMongoDB();
await connectToRedis();

app.get("/", (req, res) => {
  const response = new ApiResponse(200, "user is up!");

  res.json(response);
});

app.listen(process.env.PORT, () => {
  console.log(`User Service is running on port: ${process.env.PORT}`);
});

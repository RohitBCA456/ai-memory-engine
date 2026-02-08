import express from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
  methods: ['GET, POST, PUT, DELETE']
}))

app.use("/memory-service", proxy(process.env.MEMORY_ROUTE));
app.use("/embedding-service", proxy(process.env.EMBEDDING_ROUTE));

app.listen(process.env.PORT, () => {
  console.log("Gateway service running on port : ", process.env.PORT);
});

import express from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

const WAKE_UP_TIMEOUT = 120000;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const commonProxyOptions = {
  proxyTimeout: WAKE_UP_TIMEOUT,
  timeout: WAKE_UP_TIMEOUT,
  proxyErrorHandler: (err, res, next) => {
    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      return res
        .status(504)
        .send("Service is waking up, please try again in a few seconds.");
    }
    next(err);
  },
};

app.use("/memory-service", proxy(process.env.MEMORY_ROUTE, commonProxyOptions));
app.use(
  "/retrieval-service",
  proxy(process.env.RETRIEVAL_ROUTE, commonProxyOptions),
);
app.use(
  "/deletion-service",
  proxy(process.env.DELETION_ROUTE, commonProxyOptions),
);

app.use(
  "/user-service",
  proxy(process.env.USER_ROUTE, {
    ...commonProxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.headers["authorization"]) {
        proxyReqOpts.headers["authorization"] = srcReq.headers["authorization"];
      }
      return proxyReqOpts;
    },
  }),
);

app.listen(process.env.PORT, () => {
  console.log("Gateway service running on port : ", process.env.PORT);
});

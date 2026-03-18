import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import { config } from "./config.js";
import { ApiResponse } from "../../shared/utilities/ApiResponse.js";

const app = express();

app.use(
  cors({
    origin: config.allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const commonProxyOptions = {
  proxyTimeout: config.timeout,
  timeout: config.timeout,
  proxyErrorHandler: (err, res, next) => {
    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      return res
        .status(504)
        .send("Service is waking up, please try again in a few seconds.");
    }
    next(err);
  },
};

app.use("/memory-service", proxy(config.routes.memory, commonProxyOptions));
app.use(
  "/retrieval-service",
  proxy(config.routes.retrieval, commonProxyOptions),
);
app.use("/deletion-service", proxy(config.routes.deletion, commonProxyOptions));
app.use("/rag-service", proxy(config.routes.RAG, commonProxyOptions));

app.use(
  "/user-service",
  proxy(config.routes.user, {
    ...commonProxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.headers["authorization"]) {
        proxyReqOpts.headers["authorization"] = srcReq.headers["authorization"];
      }
      return proxyReqOpts;
    },
  }),
);

app.get("/", (req, res) => {
  const response = new ApiResponse(200, "api-gateway is up!");

  res.json(response);
});

app.listen(config.port, () => {
  console.log(
    `Gateway running in ${config.isProduction ? "PRODUCTION" : "DEVELOPMENT"} mode on port ${config.port}`,
  );
});

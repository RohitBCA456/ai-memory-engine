import { asyncHandler } from "../utilities/asyncHandler.js";

export const createRedisSchema = asyncHandler(async (client) => {

  if (await client.ft.info("memory_index").catch(() => null)) {
    console.log("Redis schema already exists");
    return client;
  }

  await client.ft.create(
    "memory_index",
    {
      userId: {
        type: "TAG",
        AS: "userId",
      },
      content: {
        type: "TEXT",
        AS: "content",
      },
      type: {
        type: "TAG",
        AS: "type",
      },
      embedding: {
        type: "VECTOR",
        ALGORITHM: "HNSW",
        TYPE: "FLOAT32",
        DIM: 1536,
        DISTANCE_METRIC: "COSINE",
        AS: "embedding",
      },
      createdAt: {
        type: "NUMERIC",
        AS: "createdAt",
      },
      score: {
        type: "NUMERIC",
        AS: "score",
      },
    },
    {
      ON: "HASH",
      PREFIX: "mem:",
    },
  );

  return client;
});

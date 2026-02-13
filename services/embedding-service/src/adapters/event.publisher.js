import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { publishEvent } from "../../../event-bus/src/producer.js";

export const publishgMemoryEmbedding = asyncHandler(async (event, memory) => {
  await publishEvent(event, {
    userId: memory.userId,
    content: memory.content,
    correlationId: memory.correlationId,
    type: memory.type,
    embedding: memory.embedding,
    createdAt: memory.createdAt,
  });
});

import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { MemoryModel } from "../../../../shared/models/memory.model.js";

export const storeToMongoDB = asyncHandler(async (data) => {
  return await MemoryModel.create({
    userId: data.userId,
    content: data.content,
    metadata: data.metadata,
    appId: data.appId,
    type: data.type,
    embedding: data.embedding,
    score: data.score,
  });
});

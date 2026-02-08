import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { MemoryModel } from "../../../../shared/models/memory.model.js";

export const storeToMongoDB = asyncHandler(async (data) => {
  await MemoryModel.create({
    userId: data.userId,
    content: data.content,
    type: data.type,
    embedding: data.embedding,
    score: data.score,
  });
});

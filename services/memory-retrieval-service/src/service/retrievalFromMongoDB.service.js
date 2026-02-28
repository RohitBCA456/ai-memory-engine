import { MemoryModel } from "../../../../shared/models/memory.model.js";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";

export const retrieveFromMongoDB = asyncHandler(async (memoryId) => {
  const document = await MemoryModel.findOne({ _id: memoryId });

  if (!document) {
    console.log("No document found for ID:", memoryId);
    return null;
  }

  return document.content;
});

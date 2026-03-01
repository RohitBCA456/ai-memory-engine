import mongoose from "mongoose";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { mongoDBMemoryDeletion } from "../services/deleteFromMongoDB.service.js";
import { redisMemoryDeletion } from "../services/deleteFromRedis.service.js";

export const memoryDeletion = asyncHandler(async (req, res) => {
  const { memoryId } = req.body;

  if (!memoryId) {
    return res.status(400).json({
      message: "MemoryId is Missing",
    });
  }

  const isValid = mongoose.Types.ObjectId.isValid(memoryId);

  if (isValid) {
    const result = await mongoDBMemoryDeletion(memoryId);

    if (result) {
      return res.status(200).json({
        message: "Memory Deleted Sucessfully From MongoDB.",
      });
    }
  } else {
    const result = await redisMemoryDeletion(memoryId);

    if (result) {
      return res.status(200).json({
        message: "Memory Deleted Sucessfully From Redis.",
      });
    }
  }
});

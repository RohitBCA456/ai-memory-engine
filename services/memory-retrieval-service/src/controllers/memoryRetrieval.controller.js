import mongoose from "mongoose";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { retrieveFromMongoDB } from "../service/retrievalFromMongoDB.service.js";
import { retrieveFromRedis } from "../service/retrievalFromRedis.service.js";

export const memoryRetrieval = asyncHandler(async (req, res) => {
  const { memoryId } = req.body;

  if (!memoryId) {
    return res.status(400).json({
      message: "MemoryId is Missing",
    });
  }

  const isValid = mongoose.Types.ObjectId.isValid(memoryId);

  if (isValid) {
    const content = await retrieveFromMongoDB(memoryId);

    return res.status(200).json({
      message: "content found",
      content: content,
    });
  } else {
    const content = await retrieveFromRedis(memoryId);

    return res.status(200).json({
      message: "content found",
      content: content,
    });
  }
});

import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { ingestMemory } from "../services/memory.service.js";

export const addMemory = asyncHandler(async (req, res) => {
  const { userId, content } = req.body;
  const appId = req.appId;

  if (!userId || !content || !appId) {
    return res.status(400).json({ message: "Fields are missing" });
  }

  const result = await ingestMemory(userId, content, appId);

  return res.status(202).json(result);
});

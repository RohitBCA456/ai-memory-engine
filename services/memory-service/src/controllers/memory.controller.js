import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { ingestMemory } from "../services/memory.service.js";

export const addMemory = asyncHandler(async (req, res) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ message: "Fields are missing" });
  }

  const result = await ingestMemory(userId, content);

  return res.status(202).json(result);
});

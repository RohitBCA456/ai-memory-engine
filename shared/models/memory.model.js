import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
  score: Number,
  frequency: { type: Number, default: 1 },
  lastSeenAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export const MemoryModel = mongoose.model("Memory", memorySchema);

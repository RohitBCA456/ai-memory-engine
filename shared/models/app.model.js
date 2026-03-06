import mongoose, { Schema } from "mongoose";

const AppSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Application name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "", 
    },
    apiKey: {
      type: String,
      required: true,
      unique: true, 
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

export const App = mongoose.model("App", AppSchema);
import mongoose from "mongoose";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";

export const connectToMongoDB = asyncHandler(async () => {
  const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
  console.log(`connected to ${connectionInstance.connection.host}`);
});

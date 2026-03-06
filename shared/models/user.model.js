import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    imageUrl: {
      type: String,
    },
    webToken: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.methods.generateWebToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      clerkId: this.clerkId,
      email: this.email,
      username: this.username,
    },
    process.env.WEB_TOKEN_SECRET,
    {
      expiresIn: process.env.WEB_TOKEN_EXPIRY || "7d",
    },
  );
};

export const User = mongoose.model("User", UserSchema);

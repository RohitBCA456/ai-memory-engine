import { App } from "../models/app.model.js";
import { connectToMongoDB } from "../connectors/mongodb.connector.js";

export const validateApp = async (req, res, next) => {
  const apiKey = req.header("x-api-key");

  await connectToMongoDB();
  const app = await App.findOne({ apiKey }).select("_id owner");

  if (!app) {
    return res.status(401).json({ message: "Invalid API Key" });
  }

  req.appId = app._id;
  req.ownerId = app.owner;
  next();
};

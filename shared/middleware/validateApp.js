// shared/middleware/validateApp.js

import { App } from "../models/app.model.js";
import { connectToMongoDB } from "../connectors/mongodb.connector.js";

export const validateApp = async (req, res, next) => {
  const apiKey = req.header("x-api-key");

  console.log(apiKey)

  await connectToMongoDB();
  // This is the only place that talks to the App model
  const app = await App.findOne({ apiKey }).select("_id owner");

  if (!app) {
    return res.status(401).json({ message: "Invalid API Key" });
  }

  // Pass the ID forward so other services don't need to query the DB
  req.appId = app._id;
  req.ownerId = app.owner;
  next();
};

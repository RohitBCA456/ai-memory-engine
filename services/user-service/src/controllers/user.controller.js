import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { User } from "../../../../shared/models/user.model.js";
import { App } from "../../../../shared/models/app.model.js";
import { generateApiKey } from "../services/apiKey.service.js";
import { MemoryModel } from "../../../../shared/models/memory.model.js";
import { redisClient } from "../../../../shared/connectors/redis.connector.js";

export const saveCredentials = asyncHandler(async (req, res) => {
  const { username, imageUrl, email, clerkId } = req.body;

  if (
    [username, email, clerkId].some((field) => !field || field.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields (username, email, clerkId) are required",
    });
  }

  let user = await User.findOne({ clerkId });

  if (user) {
    user.username = username;
    user.imageUrl = imageUrl;
    user.email = email;
  } else {
    user = await User.create({
      clerkId,
      username,
      imageUrl,
      email,
    });
  }

  const webToken = await user.generateWebToken();
  user.webToken = webToken;

  await user.save();

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  };

  return res
    .status(200)
    .cookie("webToken", webToken, options)
    .json({
      success: true,
      message: "User credentials synced successfully",
      data: {
        username: user.username,
        email: user.email,
        webToken: webToken,
      },
    });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized request" });
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { 
      $set: { webToken: "" } 
    },
    { new: true } 
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  };

  return res.status(200).clearCookie("webToken", options).json({
    success: true,
    message: "User logged out successfully",
  });
});

export const createApp = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Application name is required",
    });
  }

  const apiKey = generateApiKey();

  const newApp = await App.create({
    name,
    description,
    apiKey,
    owner: req.user._id,
  });

  if (!newApp) {
    return res.status(500).json({
      success: false,
      message: "Failed to provision application instance",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Application created successfully",
    data: {
      id: newApp._id,
      name: newApp.name,
      apiKey: newApp.apiKey,
    },
  });
});

export const manageApps = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access: No user context found",
    });
  }

  const userApps = await App.find({ owner: userId }).sort({ createdAt: -1 });

  if (!userApps) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "No applications found for this account",
    });
  }

  return res.status(200).json({
    success: true,
    count: userApps.length,
    data: userApps,
    message: "Applications retrieved successfully",
  });
});

export const getAppTelemetry = asyncHandler(async (req, res) => {
  const { appId } = req.params;

  const app = await App.findOne({ _id: appId, owner: req.user._id });
  if (!app)
    return res.status(404).json({ success: false, message: "App not found" });

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // 2. Fetch MongoDB Stats (Long-Term)
  const mongoStats = await MemoryModel.aggregate([
    { $match: { appId: app._id, createdAt: { $gte: last24Hours } } },
    { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
  ]);

  const redisKeys = await redisClient.keys(`mem:${appId}:*`);

  // 4. Initialize 24-hour buckets matching your UI
  const intervals = [
    "00:00",
    "04:00",
    "08:00",
    "12:00",
    "16:00",
    "20:00",
    "Now",
  ];
  const telemetry = intervals.map((time) => ({
    time,
    longTerm: 0,
    shortTerm: 0,
  }));

  // Populate MongoDB data into intervals
  mongoStats.forEach((stat) => {
    const bucketIndex = Math.floor(stat._id / 4);
    if (telemetry[bucketIndex]) telemetry[bucketIndex].longTerm += stat.count;
  });

  // Populate Redis data into intervals
  redisKeys.forEach((key) => {
    const timestamp = parseInt(key.split(":").pop());
    if (timestamp > last24Hours.getTime()) {
      const hour = new Date(timestamp).getHours();
      const bucketIndex = Math.floor(hour / 4);
      if (telemetry[bucketIndex]) telemetry[bucketIndex].shortTerm += 1;
    }
  });

  return res.status(200).json({ success: true, data: telemetry });
});

export const getAppMemories = asyncHandler(async (req, res) => {
  const { appId } = req.params;
  const { type = "all" } = req.query;

  // Normalize the type to lowercase for easier comparison
  const filterType = type.toLowerCase(); 

  let combinedMemories = [];

  // 1. Fetch from Redis (Short-Term)
  if (filterType === "all" || filterType === "redis") {
    const keys = await redisClient.keys(`mem:${appId}:*`);
    const redisData = await Promise.all(
      keys.slice(0, 20).map(async (key) => {
        const data = await redisClient.hGetAll(key);
        return {
          id: key,
          storageType: "Redis",
          contentPreview: data.content?.substring(0, 50) + "...",
          createdAt: new Date(parseInt(data.createdAt)),
        };
      }),
    );
    combinedMemories = [...redisData];
  }

  // 2. Fetch from MongoDB (Long-Term)
  if (filterType === "all" || filterType === "mongodb") {
    const mongoData = await MemoryModel.find({ appId })
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedMongo = mongoData.map((m) => ({
      id: m._id,
      storageType: "MongoDB",
      contentPreview: m.content.substring(0, 50) + "...",
      createdAt: m.createdAt,
    }));
    combinedMemories = [...combinedMemories, ...formattedMongo];
  }

  // 3. Final Sort (Newest First)
  combinedMemories.sort((a, b) => b.createdAt - a.createdAt);

  return res.status(200).json({
    success: true,
    data: combinedMemories.slice(0, 50),
  });
});

// services/user-service/src/controllers/user.controller.js

export const getGlobalStats = asyncHandler(async (req, res) => {
  try {
    // 1. Get MongoDB Count (Long-Term)
    const mongoCount = await MemoryModel.countDocuments(); // Ensure 'Memory' is your MongoDB model

    // 2. Get Redis Count (Short-Term) for 'mem' prefix only
    // Using the pattern shown in your image: mem:[appId]
    const keys = await redisClient.keys('mem:*'); 
    const redisCount = keys.length;

    return res.status(200).json({
      success: true,
      data: {
        longTerm: mongoCount,
        shortTerm: redisCount,
        total: mongoCount + redisCount
      }
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ success: false, message: "Error calculating engine stats" });
  }
});

export const deleteApp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Attached by verifyAuth

  // 1. Find and delete only if the owner matches
  const deletedApp = await App.findOneAndDelete({
    _id: id,
    owner: userId 
  });

  if (!deletedApp) {
    return res.status(404).json({
      success: false,
      message: "Application not found or unauthorized"
    });
  }

  // 2. Return success so frontend can update state
  return res.status(200).json({
    success: true,
    message: "Application deleted successfully"
  });
});
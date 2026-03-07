import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";
import { User } from "../../../../shared/models/user.model.js";
import { App } from "../../../../shared/models/app.model.js";
import { generateApiKey } from "../services/apiKey.service.js";
import { MemoryModel } from "../../../../shared/models/memory.model.js";
import { redisClient } from "../../../../shared/connectors/redis.connector.js";
import mongoose from "mongoose";

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
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized request" });
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: { webToken: "" },
    },
    { new: true },
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

  const mongoStats = await MemoryModel.aggregate([
    { $match: { appId: appId.toString(), createdAt: { $gte: last24Hours } } },
    {
      $group: {
        _id: {
          $hour: {
            date: "$createdAt",
            timezone: "Asia/Kolkata",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const redisKeys = await redisClient.keys(`mem:${appId}:*`);

  const intervals = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
  const telemetry = intervals.map((time) => ({
    time,
    longTerm: 0,
    shortTerm: 0,
  }));

  const getBucketIndex = (hour) => {
    if (hour >= 24) hour = 0;
    return Math.floor(hour / 4);
  };

  mongoStats.forEach((stat) => {
    const index = getBucketIndex(stat._id);
    if (telemetry[index]) telemetry[index].longTerm += stat.count;
  });

  redisKeys.forEach((key) => {
    const timestamp = parseInt(key.split(":").pop());

    const date = new Date(timestamp);

    const istHourString = date.toLocaleString("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });

    const hour = parseInt(istHourString);
    const index = getBucketIndex(hour);

    if (telemetry[index]) {
      telemetry[index].shortTerm += 1;
    }
  });

  return res.status(200).json({ success: true, data: telemetry });
});

export const getAppMemories = asyncHandler(async (req, res) => {
  const { appId } = req.params;
  const { type = "all" } = req.query;

  const filterType = type.toLowerCase();

  let combinedMemories = [];

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

  combinedMemories.sort((a, b) => b.createdAt - a.createdAt);

  return res.status(200).json({
    success: true,
    data: combinedMemories.slice(0, 50),
  });
});

export const getGlobalStats = asyncHandler(async (req, res) => {
  try {
    const mongoCount = await MemoryModel.countDocuments();

    const keys = await redisClient.keys("mem:*");
    const redisCount = keys.length;

    return res.status(200).json({
      success: true,
      data: {
        longTerm: mongoCount,
        shortTerm: redisCount,
        total: mongoCount + redisCount,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error calculating engine stats" });
  }
});

export const deleteApp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const deletedApp = await App.findOneAndDelete({
    _id: id,
    owner: userId,
  });

  if (!deletedApp) {
    return res.status(404).json({
      success: false,
      message: "Application not found or unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Application deleted successfully",
  });
});

export const deleteMemory = asyncHandler(async (req, res) => {
  const { memoryId } = req.params;

  if (!memoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Memory ID parameter is missing" });
  }

  let deleted = false;

  if (mongoose.Types.ObjectId.isValid(memoryId)) {
    const result = await MemoryModel.deleteOne({ _id: memoryId });
    deleted = result.deletedCount > 0;
  } else {
    const result = await redisClient.del(memoryId);
    deleted = result > 0;
  }

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Memory not found in any storage engine",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Memory successfully removed",
  });
});

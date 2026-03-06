import jwt from "jsonwebtoken";
import { User } from "../../../../shared/models/user.model.js";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";

export const verifyAuth = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.webToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request: No token provided",
      });
    }

    const decodedToken = jwt.verify(token, process.env.WEB_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-webToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Access Token: User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error?.message || "Invalid Access Token",
    });
  }
});

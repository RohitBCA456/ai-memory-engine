import { Router } from "express";
import {
  createApp,
  getAppMemories,
  getAppTelemetry,
  logoutUser,
  manageApps,
  saveCredentials,
  getGlobalStats,
  deleteApp,
} from "../controllers/user.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/save-credentials").post(saveCredentials);
router.route("/logout").get(verifyAuth, logoutUser);
router.route("/create-app").post(verifyAuth, createApp);
router.route("/manage-app").get(verifyAuth, manageApps);
router.route("/telemetry/:appId").get(verifyAuth, getAppTelemetry);
router.route("/memories/:appId").get(getAppMemories);
router.route("/global-stats").get(verifyAuth, getGlobalStats);
router.route("/delete-app/:id").delete(verifyAuth, deleteApp);

export { router as userRouter };

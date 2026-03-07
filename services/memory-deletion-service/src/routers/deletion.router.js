import { Router } from "express";
import { memoryDeletion } from "../controllers/deletion.controller.js";
import { validateApp } from "../../../../shared/middleware/validateApp.js";

const router = Router();

router.route("/delete-memory/:memoryId").delete(validateApp, memoryDeletion);

export { router as DeletionRouter };

import { Router } from "express";
import { memoryDeletion } from "../controllers/deletion.controller.js";

const router = Router();

router.route("/delete-memory").delete(memoryDeletion);

export { router as DeletionRouter };

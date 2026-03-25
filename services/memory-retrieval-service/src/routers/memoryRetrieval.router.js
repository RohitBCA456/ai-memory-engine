import { Router } from "express";
import { memoryRetrieval } from "../controllers/memoryRetrieval.controller.js";
import { validateApp } from "../../../../shared/middleware/validateApp.js";

const router = Router();

router.route("/retrieve-memory").post(validateApp, memoryRetrieval);

export { router as retrievalRouter };
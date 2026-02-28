import { Router } from "express";
import { memoryRetrieval } from "../controllers/memoryRetrieval.controller.js";

const router = Router();

router.route("/retrieve-memory").post(memoryRetrieval);

export { router as retrievalRouter };
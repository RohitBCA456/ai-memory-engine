import { Router } from "express";
import { addMemory } from "../controllers/memory.controller.js";

const router = Router();

router.route("/memory").post(addMemory);

export { router as memoryRouter };

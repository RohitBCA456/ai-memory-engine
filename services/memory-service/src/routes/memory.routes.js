import { Router } from "express";
import { addMemory } from "../controllers/memory.controller.js";
import { validateApp } from "../../../../shared/middleware/validateApp.js";

const router = Router();

router.route("/memory").post(validateApp, addMemory);

export { router as memoryRouter };

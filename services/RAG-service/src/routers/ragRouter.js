import { Router } from "express";
import { askDocs } from "../controllers/ragController.js";

const router = Router();

router.route("/query").post(askDocs);

export { router as ragRouter };

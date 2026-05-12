import { Router } from "express";
import { correctGrammar } from "../controllers/aiController";

const router = Router();

router.post("/correct-grammar", correctGrammar);

export default router;
import { Router } from "express";
import { createNote, getNote, updateNote } from "../controllers/notesController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, createNote);
router.get("/", auth, getNote);
router.put("/:id", auth, updateNote);

export default router
import { Router } from "express";
import { createNote, getNote, updateNote, deleteNote } from "../controllers/notesController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, createNote);
router.get("/", auth, getNote);
router.delete("/:id", auth, deleteNote);
router.put("/:id", auth, updateNote);

export default router
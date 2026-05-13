import { Router } from "express";
import { createNote, getNote, updateNote, deleteNote, shareNote, getSharedNote } from "../controllers/notesController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, createNote);
router.get("/", auth, getNote);
router.post("/:id/share", auth, shareNote);
router.get("/shared/:shareId", getSharedNote);
router.delete("/:id", auth, deleteNote);
console.log("Note DELETE route registered");
router.put("/:id", auth, updateNote);

export default router
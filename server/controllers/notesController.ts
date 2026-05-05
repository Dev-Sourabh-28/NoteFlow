import {Response} from 'express';
import Note from "../models/Note";
import { AuthRequest } from '../middleware/auth';

export const createNote = async(req: AuthRequest, res: Response) => {
    const {title, content} = req.body;
    const note = await Note.create({
        userId: req.user.id,
        title: title || "Untitled",
        content: content || "",
    });

    res.json(note);
};

export const getNote = async(req: AuthRequest, res: Response) => {
    const notes = await Note.find({userId: req.user.id}).sort({updatedAt: -1});
    res.json(notes);
};

export const updateNote = async(req: AuthRequest, res: Response) => {
    const {title, content} = req.body;

    const note = await Note.findByIdAndUpdate(
        req.params.id,
        {title, content},
        {new: true}
    );

    res.json(note);
}

export const deleteNote = async(req: AuthRequest, res: Response) => {
    try {
        const note = await Note.findById(req.params.id);

        if(!note){
            return res.status(404).json({msg: "Note not found"});
        }

        if(note.userId !== req.user.id){
            return res.status(403).json({msg: "Unauthorized"});
        }

        await Note.findByIdAndDelete(req.params.id);

        res.json({msg: "Note deleted successfully"});
    } catch (error) {
        res.status(500).json({msg: "Server error"});
    }
}
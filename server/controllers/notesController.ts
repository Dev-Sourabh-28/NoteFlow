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
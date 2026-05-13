import { Request, Response } from "express";
import Note, {INote} from "../models/Note";
import { AuthRequest } from '../middleware/auth';
import {v4 as uuidv4} from "uuid";

export const shareNote = async(
    req: AuthRequest,
    res: Response
) => {
    try {
        const {permission} = req.body;

        const note = await Note.findById(req.params.id) as INote | null;

        if(!note){
            return res.status(404).json({
                msg: "Note not found",
            });
        }

        note.isShared = true;

        note.sharePermission = permission;

        if(!note.shareId){
            note.shareId = uuidv4();
        }

        await note.save();

        res.json({
            shareLink:
            `${process.env.CLIENT_URL}/shared/${note.shareId}`
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Share failed",
        })
    }
}

export const getSharedNote = async(
   req: Request,
   res: Response
) => {
    try {
        const note = await Note.findOne({
            shareId: req.params.shareId,
            isShared: true,
        });

        if(!note){
            return res.status(404).json({
                msg: "Note not found",
            });
        }

        res.json(note);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server error",
        });
    }
}

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

    const note = await Note.findById(req.params.id) as INote | null;

    if(!note){
        return res.status(404).json({msg: "Note not found"});
    }

    // Check if user is owner or has edit permission for shared note
    if(note.userId !== req.user.id){
        if(!note.isShared || note.sharePermission !== "edit"){
            return res.status(403).json({msg: "Unauthorized"});
        }
    }

    note.title = title;
    note.content = content;
    await note.save();

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
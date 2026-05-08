import mongoose from "mongoose";

const subnoteSchema = new mongoose.Schema({
    title: String,
    content: String,
    noteId: {type: mongoose.Schema.Types.ObjectId, ref: 'Note'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

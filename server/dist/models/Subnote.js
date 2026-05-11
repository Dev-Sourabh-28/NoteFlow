"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subnoteSchema = new mongoose_1.default.Schema({
    title: String,
    content: String,
    noteId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Note' },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }
});

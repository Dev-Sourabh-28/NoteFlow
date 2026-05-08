"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.getNote = exports.createNote = void 0;
const Note_1 = __importDefault(require("../models/Note"));
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const note = yield Note_1.default.create({
        userId: req.user.id,
        title: title || "Untitled",
        content: content || "",
    });
    res.json(note);
});
exports.createNote = createNote;
const getNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notes = yield Note_1.default.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(notes);
});
exports.getNote = getNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const note = yield Note_1.default.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    res.json(note);
});
exports.updateNote = updateNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield Note_1.default.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ msg: "Note not found" });
        }
        if (note.userId !== req.user.id) {
            return res.status(403).json({ msg: "Unauthorized" });
        }
        yield Note_1.default.findByIdAndDelete(req.params.id);
        res.json({ msg: "Note deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});
exports.deleteNote = deleteNote;

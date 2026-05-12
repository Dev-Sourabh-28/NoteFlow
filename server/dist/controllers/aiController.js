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
exports.correctGrammar = void 0;
const openai_1 = __importDefault(require("openai"));
const correctGrammar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({
                msg: "Text is required",
            });
        }
        const client = new openai_1.default({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });
        const completion = yield client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "Correct grammar and spelling only. Keep meaning same.",
                },
                {
                    role: "user",
                    content: text,
                },
            ],
        });
        const corrected = completion.choices[0].message.content;
        res.json({
            corrected,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "AI Error",
        });
    }
});
exports.correctGrammar = correctGrammar;

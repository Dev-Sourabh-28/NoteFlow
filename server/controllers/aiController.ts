import { Request, Response } from "express";
import OpenAI from "openai";

export const correctGrammar = async (
  req: Request,
  res: Response
) => {

  try {

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        msg: "Text is required",
      });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Correct grammar and spelling only. Keep meaning same.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      });

    const corrected =
      completion.choices[0].message.content;

    res.json({
      corrected,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "AI Error",
    });
  }
};
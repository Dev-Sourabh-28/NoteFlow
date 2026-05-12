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

    // Check if API key is available
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        msg: "API key configuration error",
        error: "GROQ_API_KEY environment variable is not set"
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
    console.error("AI Controller Error:", error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(500).json({
          msg: "API key configuration error",
          error: "Invalid or missing API key"
        });
      }
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return res.status(429).json({
          msg: "API quota exceeded",
          error: "Rate limit reached"
        });
      }
    }

    res.status(500).json({
      msg: "AI service temporarily unavailable",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
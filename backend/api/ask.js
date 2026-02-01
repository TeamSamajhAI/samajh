import express from "express";
import { answerQuestion } from "../services/answerService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, language = "en" } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const result = await answerQuestion(question);

    res.json({
      answer: result.answer,
      sources: result.sources,
      language,
    });
  } catch (err) {
    console.error("❌ RAG error:", err);
    res.status(500).json({ error: "Failed to generate answer" });
  }
});

export default router;

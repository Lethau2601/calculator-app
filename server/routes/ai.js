const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ==========================
//   AI ASK ROUTE
// ==========================
router.post('/ask', async (req, res) => {
  try {
    console.log("Incoming AI request body:", req.body); // DEBUG

    // Prevent crash when req.body is empty
    const { userId = null, question = null, conversationType = "general" } = req.body || {};

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question is required"
      });
    }

    // GROQ AI CALL
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant. Answer clearly and simply." },
        { role: "user", content: question }
      ]
    });

    const fullAnswer = response.choices?.[0]?.message?.content || "No answer received.";

    // Save to DB only if userId exists
    if (userId) {
      await query(
        `INSERT INTO ai_conversations (user_id, question, answer, conversation_type)
         VALUES ($1, $2, $3, $4)`,
        [userId, question, fullAnswer, conversationType]
      );
    }

    res.json({ success: true, answer: fullAnswer });

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ success: false, error: "AI request failed" });
  }
});

// ==========================
//   GET HISTORY
// ==========================
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(
      `SELECT * FROM ai_conversations 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 20`,
      [userId]
    );

    res.json({ success: true, data: result.rows });

  } catch (error) {
    console.error("Fetch History Error:", error);
    res.status(500).json({ success: false, error: "Failed to load history" });
  }
});

module.exports = router;

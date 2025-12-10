const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// SAVE AI CONVERSATION
router.post('/conversation', async (req, res) => {
  try {
    const { userId, question, answer, conversationType } = req.body;
    const result = await query(
      'INSERT INTO ai_conversations (user_id, question, answer, conversation_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, question, answer, conversationType]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving AI conversation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET AI CONVERSATION HISTORY
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await query(
      'SELECT * FROM ai_conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching AI history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
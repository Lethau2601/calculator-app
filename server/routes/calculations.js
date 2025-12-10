const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET ALL CALCULATIONS FOR A USER
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, type } = req.query;

    let queryText = `
      SELECT id, calculator_type, expression, result, created_at
      FROM calculation_history
      WHERE user_id = $1
    `;
    
    const params = [userId];
    
    if (type) {
      queryText += ` AND calculator_type = $${params.length + 1}`;
      params.push(type);
    }
    
    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching calculations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch calculations' 
    });
  }
});

// SAVE NEW CALCULATION
router.post('/', async (req, res) => {
  try {
    const { userId, calculatorType, expression, result } = req.body;

    if (!userId || !calculatorType || !expression || result === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const queryText = `
      INSERT INTO calculation_history (user_id, calculator_type, expression, result)
      VALUES ($1, $2, $3, $4)
      RETURNING id, calculator_type, expression, result, created_at
    `;

    const queryResult = await query(queryText, [userId, calculatorType, expression, result]);

    res.status(201).json({
      success: true,
      data: queryResult.rows[0],
      message: 'Calculation saved successfully'
    });
  } catch (error) {
    console.error('Error saving calculation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save calculation' 
    });
  }
});

// GET CALCULATION STATISTICS
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const queryText = `
      SELECT 
        calculator_type,
        COUNT(*) as count,
        MAX(created_at) as last_used
      FROM calculation_history
      WHERE user_id = $1
      GROUP BY calculator_type
      ORDER BY count DESC
    `;

    const result = await query(queryText, [userId]);

    const totalQuery = await query(
      'SELECT COUNT(*) as total FROM calculation_history WHERE user_id = $1',
      [userId]
    );

    res.json({
      success: true,
      data: {
        byType: result.rows,
        total: parseInt(totalQuery.rows[0].total)
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    });
  }
});

// DELETE CALCULATION
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const queryText = `
      DELETE FROM calculation_history
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await query(queryText, [id, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Calculation not found'
      });
    }

    res.json({
      success: true,
      message: 'Calculation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting calculation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete calculation' 
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { query, transaction } = require('../config/database');

// REGISTER NEW USER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const checkQuery = 'SELECT id FROM users WHERE username = $1 OR email = $2';
    const existing = await query(checkQuery, [username, email]);

    if (existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        error: 'Username or email already exists'
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await transaction(async (client) => {
      const userQuery = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
      `;
      const userResult = await client.query(userQuery, [username, email, passwordHash]);
      const user = userResult.rows[0];

      const prefsQuery = `INSERT INTO user_preferences (user_id) VALUES ($1)`;
      await client.query(prefsQuery, [user.id]);

      return user;
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to register user' 
    });
  }
});

// LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    const userQuery = `
      SELECT id, username, email, password_hash, is_active
      FROM users
      WHERE username = $1
    `;
    const result = await query(userQuery, [username]);

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const { password_hash, ...userData } = user;

    res.json({
      success: true,
      data: userData,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to login' 
    });
  }
});

// GET USER PROFILE
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const queryText = `
      SELECT 
        u.id, u.username, u.email, u.created_at, u.last_login,
        p.theme, p.default_calculator, p.decimal_places, p.angle_mode
      FROM users u
      LEFT JOIN user_preferences p ON u.id = p.user_id
      WHERE u.id = $1 AND u.is_active = true
    `;

    const result = await query(queryText, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user' 
    });
  }
});

module.exports = router;
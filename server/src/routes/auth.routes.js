
const express = require('express');
const router = express.Router();
const pool = require('../db/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// (OTP and email imports removed as they are no longer used)

// (OTP routes removed as per user request for normal human verification)

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // (OTP verification removed)

        // Check if user exists (Username or Email)
        console.log(`Attempting signup for: ${username} (${email})`);
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (userCheck.rows.length > 0) {
            console.log('Signup failed: Username or Email already exists');
            return res.status(400).json({ error: 'Username or Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(`Signup successful for: ${username}`);
        res.json({ token, user: newUser.rows[0] });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body; // 'username' field can assume strictly username or email based on input, but let's keep it generic

    try {
        // Check user by Username or Email
        const user = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

module.exports = router;

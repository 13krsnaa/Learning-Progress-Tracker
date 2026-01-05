
const express = require('express');
const router = express.Router();
const pool = require('../db/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/otp');
const { sendOTP } = require('../utils/email');

// Send OTP (for Signup/Verification)
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        // Check if email already exists
        const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const otp = generateOTP();
        await storeOTP(email, otp);
        const sent = await sendOTP(email, otp);

        if (sent) {
            res.json({ message: 'OTP sent successfully' });
        } else {
            res.status(500).json({ error: 'Failed to send email' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { username, email, password, otp } = req.body;

    try {
        // Verify OTP
        const isValidOTP = await verifyOTP(email, otp);
        if (!isValidOTP) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Check if user exists (Username or Email)
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (userCheck.rows.length > 0) {
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

        res.json({ token, user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields (username, email, password) are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password validation failed: Minimum 6 characters' });
    }

    try {
        console.log('📝 Signup attempt:', { username, email, timestamp: new Date().toISOString() });

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                console.log('❌ Signup failed: Email already exists:', email);
                return res.status(409).json({ error: 'Email already exists' });
            }
            console.log('❌ Signup failed: Username already exists:', username);
            return res.status(409).json({ error: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1d' });

        console.log('✅ Signup successful:', username);

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
            message: 'User created successfully'
        });
    } catch (err) {
        console.error('❌ Signup error:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        console.log('🔐 Login attempt:', { username, timestamp: new Date().toISOString() });

        const user = await User.findOne({
            $or: [{ username: username }, { email: username }]
        });

        if (!user) {
            console.log('❌ Login failed: User not found for username/email:', username);
            return res.status(401).json({ error: 'Invalid credentials: User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('❌ Login failed: Invalid password for user:', user.username);
            return res.status(401).json({ error: 'Invalid credentials: Password incorrect' });
        }

        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1d' });

        console.log('✅ Login successful:', user.username);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

module.exports = router;

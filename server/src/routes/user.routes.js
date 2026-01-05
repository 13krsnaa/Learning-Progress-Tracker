const express = require('express');
const pool = require('../db/postgres');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get User Profile
router.get('/profile', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, full_name, bio, avatar_url, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update User Profile
router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
    const { full_name, bio } = req.body;
    let avatar_url = req.body.avatar_url;

    if (req.file) {
        // Construct URL for the uploaded file
        const protocol = req.protocol;
        const host = req.get('host');
        avatar_url = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    try {
        const result = await pool.query(
            `UPDATE users 
       SET full_name = COALESCE($1, full_name), 
           bio = COALESCE($2, bio), 
           avatar_url = COALESCE($3, avatar_url)
       WHERE id = $4 
       RETURNING id, username, full_name, bio, avatar_url`,
            [full_name, bio, avatar_url, req.user.id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

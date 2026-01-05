const express = require('express');
const router = express.Router();
const pool = require('../db/postgres');
const auth = require('../middleware/auth');

// Get all goals for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const goals = await pool.query('SELECT * FROM goals WHERE user_id = $1', [req.user.id]);
        res.json(goals.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
    const { title, description, frequency } = req.body;
    try {
        const newGoal = await pool.query(
            'INSERT INTO goals (user_id, title, description, frequency) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, title, description, frequency || 'daily']
        );
        res.json(newGoal.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a goal
router.put('/:id', auth, async (req, res) => {
    const { title, description, frequency } = req.body;
    const { id } = req.params;
    try {
        const updateGoal = await pool.query(
            'UPDATE goals SET title = $1, description = $2, frequency = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [title, description, frequency, id, req.user.id]
        );

        if (updateGoal.rows.length === 0) {
            return res.status(404).json({ error: 'Goal not found or not authorized' });
        }

        res.json(updateGoal.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteGoal = await pool.query(
            'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (deleteGoal.rows.length === 0) {
            return res.status(404).json({ error: 'Goal not found or not authorized' });
        }

        res.json({ message: 'Goal deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

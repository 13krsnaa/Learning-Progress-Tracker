
const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

// Get all goals for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const goals = await Goal.find({ user_id: req.user.id });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
    const { title, description, frequency } = req.body;
    try {
        const newGoal = new Goal({
            user_id: req.user.id,
            title,
            description,
            frequency: frequency || 'daily'
        });
        await newGoal.save();
        res.json(newGoal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a goal
router.put('/:id', auth, async (req, res) => {
    const { title, description, frequency } = req.body;
    const { id } = req.params;
    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            {
                $set: {
                    title: title || undefined,
                    description: description || undefined,
                    frequency: frequency || undefined
                }
            },
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found or not authorized' });
        }

        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const goal = await Goal.findOneAndDelete({ _id: id, user_id: req.user.id });

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found or not authorized' });
        }

        res.json({ message: 'Goal deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

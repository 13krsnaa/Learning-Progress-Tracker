
const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const auth = require('../middleware/auth');
const streakService = require('../services/streak.service');

// Get logs for the user
router.get('/', auth, async (req, res) => {
    try {
        const logs = await Log.find({ user_id: req.user.id }).sort({ date: -1 });
        const currentStreak = await streakService.getStreak(req.user.id);
        res.json({ logs, currentStreak });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create/Update a log for today
router.post('/', auth, async (req, res) => {
    const { date, goals_completed, notes } = req.body;
    // date format: YYYY-MM-DD

    try {
        let log = await Log.findOne({ user_id: req.user.id, date });

        if (log) {
            // Update existing log
            log.goals_completed = goals_completed;
            log.notes = notes;
            await log.save();
        } else {
            // Create new log
            log = new Log({
                user_id: req.user.id,
                date,
                goals_completed,
                notes
            });
            await log.save();

            // Update Streak Logic (Uses MongoDB User document now)
            await streakService.updateStreak(req.user.id, date);
        }

        // Return log with current streak
        const currentStreak = await streakService.getStreak(req.user.id);
        res.json({ ...log.toObject(), currentStreak });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

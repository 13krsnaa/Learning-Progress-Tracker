const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const auth = require('../middleware/auth');
const streakService = require('../services/streak.service');

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get Streak
        const currentStreak = await streakService.getStreak(userId);

        // Get Last 7 Days logs
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dateStr = sevenDaysAgo.toISOString().split('T')[0];

        // Ideally we would query by date range string comparison
        // Since we store date as String YYYY-MM-DD, we can do $gte if format is strictly ISO.
        // However, finding all is fine for small scale.
        const logs = await Log.find({
            user_id: userId,
            date: { $gte: dateStr }
        }).sort({ date: 1 });

        // Calculate Completion Rate
        let totalGoals = 0;
        let completedGoals = 0;

        logs.forEach(log => {
            if (log.goals_completed) {
                totalGoals += log.goals_completed.length;
                completedGoals += log.goals_completed.filter(g => g.completed).length;
            }
        });

        res.json({
            currentStreak,
            activeDaysLast7: logs.length,
            totalGoals,
            completedGoals,
            logs
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

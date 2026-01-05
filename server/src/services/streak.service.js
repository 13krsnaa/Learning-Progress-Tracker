
const User = require('../models/User');

const updateStreak = async (userId, date) => {
    try {
        const user = await User.findById(userId);
        if (!user) return 0;

        // Current streak logic
        let currentStreak = user.streak || 0;
        const lastLogDate = user.last_log_date;

        // Parse dates
        const today = new Date(date);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastLogDate === date) {
            // Already logged today, do nothing
            return currentStreak;
        }

        if (lastLogDate === yesterdayStr) {
            // Streak continues
            currentStreak += 1;
        } else {
            // Streak broken (or first time)
            currentStreak = 1;
        }

        // Save updates to User document
        user.streak = currentStreak;
        user.last_log_date = date;
        await user.save();

        return currentStreak;
    } catch (err) {
        console.error('Update streak error:', err);
        return 0;
    }
};

const getStreak = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user ? user.streak : 0;
    } catch (err) {
        console.error('Get streak error:', err);
        return 0;
    }
};

module.exports = { updateStreak, getStreak };

const redis = require('../db/redis');
const Log = require('../models/Log');

const updateStreak = async (userId, date) => {
    const key = `streak:${userId}`;

    // Get current streak
    let currentStreak = await redis.get(key) || 0;
    currentStreak = parseInt(currentStreak);

    // Check if we already logged today (to avoid double counting)
    // Logic: "date" is today YYYY-MM-DD.
    // We need to check if there was a log for *yesterday*.
    // Ideally, this check should be more robust (checking date continuity).

    // Simple Logic for now:
    // If last_log_date == yesterday, increment.
    // If last_log_date == today, do nothing.
    // If last_log_date < yesterday, reset to 1.

    const lastLogDate = await redis.get(`last_log_date:${userId}`);

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

    // Save updates
    await redis.set(key, currentStreak);
    await redis.set(`last_log_date:${userId}`, date);

    return currentStreak;
};

const getStreak = async (userId) => {
    const key = `streak:${userId}`;
    const streak = await redis.get(key) || 0;
    return parseInt(streak);
};

module.exports = { updateStreak, getStreak };

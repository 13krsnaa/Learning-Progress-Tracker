const redis = require('../db/redis');

// Generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in Redis with expiry (300 seconds = 5 minutes)
const storeOTP = async (email, otp) => {
    const key = `otp:${email}`;
    await redis.set(key, otp, 'EX', 300); // Set expiry to 5 minutes
};

// Verify OTP from Redis
const verifyOTP = async (email, otp) => {
    const key = `otp:${email}`;
    const storedOTP = await redis.get(key);

    if (storedOTP === otp) {
        await redis.del(key); // Consume OTP so it can't be used again
        return true;
    }
    return false;
};

module.exports = { generateOTP, storeOTP, verifyOTP };

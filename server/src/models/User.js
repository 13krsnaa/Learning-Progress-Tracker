const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    avatar_url: {
        type: String,
        default: ''
    },
    streak: {
        type: Number,
        default: 0
    },
    last_log_date: {
        type: String, // YYYY-MM-DD
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);

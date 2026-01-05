const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user_id: {
        type: Number, // Reference to Postgres User ID
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    goals_completed: [
        {
            goal_id: Number,
            title: String,
            completed: Boolean
        }
    ],
    notes: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Log', LogSchema);

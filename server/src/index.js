require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectMongo } = require('./db/mongo');
const redis = require('./db/redis'); // Initializes Redis connection

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectMongo();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve uploaded files


const authRoutes = require('./routes/auth.routes');
const goalRoutes = require('./routes/goals.routes');
const logRoutes = require('./routes/logs.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Learning Progress Tracker API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});

const express = require('express');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
//app.use(cors());
app.use(
  cors({
    origin: '*', //origin: 'https://your-frontend.vercel.app'
  })
);
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Backend is working');
});

module.exports = app;
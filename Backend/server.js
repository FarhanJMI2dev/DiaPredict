const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/diabetes', require('./routes/diabetesRoutes'));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    backend: 'Node.js Express Server',
    time: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Diabetes Prediction Backend API is running.',
    routes: {
      auth: '/api/auth',
      diabetes: '/api/diabetes',
      health: '/health',
    },
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[BACKEND] Express server running on port ${PORT}`);
  console.log(`[BACKEND] Connected to ML Service at ${process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'}`);
});

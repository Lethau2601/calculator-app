const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// ===== CHECK IMPORTANT ENV KEYS =====
console.log("🔑 GROQ KEY:", process.env.GROQ_API_KEY ? "LOADED" : "MISSING");
console.log("🌍 CLIENT_URL:", process.env.CLIENT_URL || "NOT SET");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== SECURITY =====
app.use(helmet());

// CORS (auto works for localhost + production)
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ===== ROUTES =====
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Calculator API is running',
    timestamp: new Date().toISOString()
  });
});

// Import route handlers
const userRoutes = require('./routes/users');
const calculationRoutes = require('./routes/calculations');
const historyRoutes = require('./routes/history');
const aiRoutes = require('./routes/ai');

app.use('/api/users', userRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ai', aiRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Calculator API',
    version: '1.0.0'
  });
});

// ===== ERROR HANDLING =====
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// ===== SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

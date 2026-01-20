const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - Configure CORS to accept requests from frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://smartsay-chuka-web.onrender.com',
    'https://smartstay-chuka-web.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Allow all origins in production (Render will handle security)
if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = '*';
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartstay-chuka')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.log('⚠️ MongoDB connection error:', err.message);
    console.log('⚠️ Running in mock mode - database features limited');
  });

// Routes
console.log('📦 Loading routes...');
try {
  const authRoutes = require('./routes/auth');
  if (!authRoutes) throw new Error('Auth routes module is empty');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.error('❌ Auth routes error:', err.message);
}

try {
  const hostelRoutes = require('./routes/hostels');
  if (!hostelRoutes) throw new Error('Hostels routes module is empty');
  app.use('/api/hostels', hostelRoutes);
  console.log('✅ Hostels routes loaded');
} catch (err) {
  console.error('❌ Hostels routes error:', err.message);
}

try {
  const paymentRoutes = require('./routes/payments');
  if (!paymentRoutes) throw new Error('Payments routes module is empty');
  app.use('/api/payments', paymentRoutes);
  console.log('✅ Payments routes loaded');
} catch (err) {
  console.error('❌ Payments routes error:', err.message);
}

try {
  const subscriptionRoutes = require('./routes/subscriptions');
  if (!subscriptionRoutes) throw new Error('Subscriptions routes module is empty');
  app.use('/api/subscriptions', subscriptionRoutes);
  console.log('✅ Subscriptions routes loaded');
} catch (err) {
  console.error('❌ Subscriptions routes error:', err.message);
}

try {
  const userRoutes = require('./routes/users');
  if (!userRoutes) throw new Error('Users routes module is empty');
  app.use('/api/users', userRoutes);
  console.log('✅ Users routes loaded');
} catch (err) {
  console.error('❌ Users routes error:', err.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Test endpoint
app.post('/api/test', (req, res) => {
  res.json({ message: 'POST test endpoint working', body: req.body });
});

// Catch-all for debugging 404s (handle all methods)
app.all('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found', 
    method: req.method,
    path: req.path,
    availableRoutes: ['/api/auth/login', '/api/auth/register', '/api/hostels', '/api/payments', '/api/health', '/api/test']
  });
});

const PORT = process.env.PORT || 5000;

// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`SMARTSTAY CHUKA backend running on port ${PORT}`);
});

// Handle any errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

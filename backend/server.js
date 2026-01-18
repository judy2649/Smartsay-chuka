const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
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
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded');
  app.use('/api/hostels', require('./routes/hostels'));
  console.log('✅ Hostels routes loaded');
  app.use('/api/payments', require('./routes/payments'));
  console.log('✅ Payments routes loaded');
  app.use('/api/subscriptions', require('./routes/subscriptions'));
  console.log('✅ Subscriptions routes loaded');
  app.use('/api/users', require('./routes/users'));
  console.log('✅ Users routes loaded');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`SMARTSTAY CHUKA backend running on port ${PORT}`);
});

// Handle any errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

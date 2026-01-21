const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Initialize PostgreSQL database (non-blocking)
require('./models/database');

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

// Routes - Import and register each separately
console.log('📦 Loading routes...');

// Try to load auth routes
try {
  console.log('Loading /api/auth...');
  const auth = require('./routes/auth');
  app.use('/api/auth', auth);
  console.log('✅ /api/auth loaded');
} catch (e) {
  console.error('❌ /api/auth failed:', e.message);
}

// Try to load hostels routes
try {
  console.log('Loading /api/hostels...');
  const hostels = require('./routes/hostels');
  app.use('/api/hostels', hostels);
  console.log('✅ /api/hostels loaded');
} catch (e) {
  console.error('❌ /api/hostels failed:', e.message);
}

// Try to load payments routes
try {
  console.log('Loading /api/payments...');
  const payments = require('./routes/payments');
  app.use('/api/payments', payments);
  console.log('✅ /api/payments loaded');
} catch (e) {
  console.error('❌ /api/payments failed:', e.message);
}

// Try to load subscriptions routes
try {
  console.log('Loading /api/subscriptions...');
  const subscriptions = require('./routes/subscriptions');
  app.use('/api/subscriptions', subscriptions);
  console.log('✅ /api/subscriptions loaded');
} catch (e) {
  console.error('❌ /api/subscriptions failed:', e.message);
}

// Try to load users routes
try {
  console.log('Loading /api/users...');
  const users = require('./routes/users');
  app.use('/api/users', users);
  console.log('✅ /api/users loaded');
} catch (e) {
  console.error('❌ /api/users failed:', e.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'SMARTSTAY CHUKA Backend API', version: '1.0.0', status: 'running' });
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

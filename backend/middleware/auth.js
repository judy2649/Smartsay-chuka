const jwt = require('jsonwebtoken');
const { User } = require('../models/database');

// Auth middleware: requires a valid token
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartstay_chuka_secret_key_12345');

    // Try to get user from database
    try {
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (dbErr) {
      console.error('DB user lookup error:', dbErr);
    }

    // Fallback: attach decoded token
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Optional auth: decode token if present, but allow anonymous access
const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartstay_chuka_secret_key_12345');
    try {
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (dbErr) {
      console.error('DB user lookup error:', dbErr);
      req.user = decoded;
    }
    next();
  } catch (error) {
    next();
  }
};

// Admin middleware: requires admin role
const adminMiddleware = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Subscription check middleware
const subscriptionMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(402).json({ 
      message: 'Subscription required - please log in first',
      code: 'NOT_SUBSCRIBED'
    });
  }

  if (!req.user.isSubscribed) {
    return res.status(402).json({ 
      message: 'Subscription required - please subscribe to continue',
      code: 'NOT_SUBSCRIBED',
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName
      }
    });
  }

  next();
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;
module.exports.adminMiddleware = adminMiddleware;
module.exports.subscriptionMiddleware = subscriptionMiddleware;

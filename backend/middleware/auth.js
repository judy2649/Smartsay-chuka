const jwt = require('jsonwebtoken');
const { _mock } = require('../controllers/authController');
const User = require('../models/User');

// Auth middleware: requires a valid token
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to attach full mock user when running offline
    if (_mock && _mock.findMockUserById) {
      const mockUser = _mock.findMockUserById(decoded.id) || _mock.findMockUserByEmail(decoded.email);
      if (mockUser) {
        req.user = { ...mockUser };
        return next();
      }
    }

    // Fallback: attach decoded token (DB-backed user expected)
    try {
      const dbUser = await User.findById(decoded.id).select('-password');
      if (dbUser) {
        req.user = dbUser;
        return next();
      }
    } catch (dbErr) {
      // ignore DB lookup errors and fall through
    }

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (_mock && _mock.findMockUserById) {
      const mockUser = _mock.findMockUserById(decoded.id) || _mock.findMockUserByEmail(decoded.email);
      if (mockUser) {
        req.user = { ...mockUser };
        return next();
      }
    }
    const dbUser = await User.findById(decoded.id).select('-password');
    if (dbUser) {
      req.user = dbUser;
    } else {
      req.user = decoded;
    }
  } catch (error) {
    // ignore token errors for optional auth
  }
  next();
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;

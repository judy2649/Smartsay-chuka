const User = require('../models/User');
const jwt = require('jsonwebtoken');

// In-memory user storage for testing (until MongoDB is connected)
const mockUsers = [];

// Create a default admin user for local/testing
const adminUser = {
  _id: 'admin-001',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@smartstay.com',
  phoneNumber: '',
  password: 'admin123',
  isSubscribed: true,
  isAdmin: true,
  createdAt: new Date()
};
mockUsers.push(adminUser);

// Helper functions for other modules (mock user access)
const findMockUserById = (id) => mockUsers.find(u => u._id === id);
const findMockUserByEmail = (email) => mockUsers.find(u => u.email === email);
const updateMockUserSubscription = (id, subscribed = true, expiryDate = null) => {
  const u = findMockUserById(id);
  if (!u) return false;
  u.isSubscribed = subscribed;
  if (expiryDate) u.subscriptionExpiryDate = expiryDate;
  return true;
};

exports._mock = { mockUsers, findMockUserById, findMockUserByEmail, updateMockUserSubscription };

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Check if user exists in mock storage
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new mock user
    const newUser = {
      _id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      isSubscribed: false,
      createdAt: new Date()
    };

    mockUsers.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        isSubscribed: newUser.isSubscribed
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in mock storage
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isSubscribed: user.isSubscribed
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

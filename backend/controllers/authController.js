const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/database');
const mockDatabase = require('../utils/mockDatabase');

// Flag to track if database is available
let isDatabaseAvailable = true;

// Helper functions for database operations
const findUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      isDatabaseAvailable = true;
      return user;
    }
  } catch (err) {
    console.warn('Database unavailable, using mock data');
    isDatabaseAvailable = false;
    // Return from mock database
    const mockUser = mockDatabase.users.find(u => u.id === id);
    return mockUser || null;
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      isDatabaseAvailable = true;
      return user;
    }
  } catch (err) {
    console.warn('Database unavailable, using mock data');
    isDatabaseAvailable = false;
    // Return from mock database
    const mockUser = mockDatabase.users.find(u => u.email === email);
    return mockUser || null;
  }
};

const updateUserSubscription = async (id, subscribed = true, expiryDate = null) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.update({
      isSubscribed: subscribed,
      subscriptionExpiryDate: expiryDate
    });
    return true;
  } catch (err) {
    console.error('Error updating subscription:', err);
    return false;
  }
};

// Export helper functions for middleware
module.exports._db = { findUserById, findUserByEmail, updateUserSubscription };

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // If database available, use it
    if (isDatabaseAvailable) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          firstName,
          lastName,
          email,
          phoneNumber: phoneNumber || '',
          password: hashedPassword,
          isSubscribed: false,
          isAdmin: false
        });

        const token = jwt.sign(
          { id: newUser.id, email: newUser.email },
          process.env.JWT_SECRET || 'smartstay_chuka_secret_key_12345',
          { expiresIn: '30d' }
        );

        return res.status(201).json({
          message: 'User registered successfully',
          token,
          user: { id: newUser.id, firstName, lastName, email, phoneNumber }
        });
      } catch (error) {
        throw error;
      }
    } else {
      // Use mock database
      const newMockUser = {
        id: String(mockDatabase.users.length + 1),
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || '',
        password, // Store as-is for mock
        isSubscribed: false,
        isAdmin: false,
        createdAt: new Date()
      };
      mockDatabase.users.push(newMockUser);

      const token = jwt.sign(
        { id: newMockUser.id, email: newMockUser.email },
        process.env.JWT_SECRET || 'smartstay_chuka_secret_key_12345',
        { expiresIn: '30d' }
      );

      return res.status(201).json({
        message: 'User registered successfully (mock data)',
        token,
        user: { id: newMockUser.id, firstName, lastName, email, phoneNumber }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (handle both hashed and mock plain text)
    let isPasswordValid = false;
    if (user.password && user.password.startsWith('$2')) {
      // Hashed password (database)
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('🔑 Database user password check');
    } else {
      // Plain text password (mock fallback)
      isPasswordValid = password === user.password;
      console.log('🔑 Mock user password check');
    }

    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Login successful:', email, '| isAdmin:', user.isAdmin);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'smartstay_chuka_secret_key_12345',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isSubscribed: user.isSubscribed || false,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Admin login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await findUserByEmail(email);
    console.log('👤 User found:', user ? `${user.email} (isAdmin: ${user.isAdmin})` : 'NOT FOUND');
    
    if (!user || !user.isAdmin) {
      console.log('❌ Admin login failed: User not found or not admin');
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Check password (handle both hashed and plain text)
    let isPasswordValid = false;
    if (user.password && user.password.startsWith('$2')) {
      // Hashed password
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('🔑 Password check: Hashed comparison');
    } else {
      // Plain text password (mock fallback)
      isPasswordValid = password === user.password;
      console.log('🔑 Password check: Plain text comparison');
    }

    if (!isPasswordValid) {
      console.log('❌ Admin login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Admin login successful:', email);
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: true },
      process.env.JWT_SECRET || 'smartstay_chuka_secret_key_12345',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        isSubscribed: user.isSubscribed
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

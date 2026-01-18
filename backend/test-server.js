const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Mock user storage
const mockUsers = [
  {
    _id: 'admin-001',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@smartstay.com',
    phoneNumber: '',
    password: 'admin123',
    isSubscribed: true,
    isAdmin: true
  }
];

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  
  if (mockUsers.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  const newUser = {
    _id: Date.now().toString(),
    firstName,
    lastName,
    email,
    phoneNumber: phoneNumber || '',
    password,
    isSubscribed: false,
    isAdmin: false
  };
  
  mockUsers.push(newUser);
  
  res.status(201).json({
    message: 'Registration successful',
    user: {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      isSubscribed: false,
      isAdmin: false
    },
    token: `test-jwt-token-${newUser._id}`
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isSubscribed: user.isSubscribed,
        isAdmin: user.isAdmin
      },
      token: `test-jwt-token-${user._id}`
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Mock hostels storage
const mockHostels = [
  {
    _id: '1',
    name: 'Hilltop Hostel',
    description: 'Comfortable and affordable hostel near Chuka University',
    location: 'Main Road, Chuka',
    distance: '0.5 km',
    phoneNumber: '0712345678',
    caretaker: 'John Mwangi',
    caretakerPhone: '0723456789',
    image: 'https://via.placeholder.com/400x250?text=Hilltop+Hostel',
    amenities: ['WiFi', 'Security', 'Water', 'Parking'],
    roomTypes: [
      { type: 'Single Room', image: 'https://via.placeholder.com/150x100?text=Single' },
      { type: 'Double Room', image: 'https://via.placeholder.com/150x100?text=Double' },
      { type: 'Dorm (4-bed)', image: 'https://via.placeholder.com/150x100?text=Dorm' }
    ]
  },
  {
    _id: '2',
    name: 'Campus View Hostel',
    description: 'Modern facilities with great university views',
    location: 'Campus Road, Chuka',
    distance: '1 km',
    phoneNumber: '0734567890',
    caretaker: 'Mary Kipchoge',
    caretakerPhone: '0745678901',
    image: 'https://via.placeholder.com/400x250?text=Campus+View',
    amenities: ['WiFi', 'TV Room', 'Security', 'Laundry'],
    roomTypes: [
      { type: 'Single Room', image: 'https://via.placeholder.com/150x100?text=Single' },
      { type: 'Dorm (6-bed)', image: 'https://via.placeholder.com/150x100?text=Dorm' }
    ]
  }
];

// Get all hostels
app.get('/api/hostels', (req, res) => {
  res.json(mockHostels);
});

// Get hostel by ID
app.get('/api/hostels/:id', (req, res) => {
  const hostel = mockHostels.find(h => h._id === req.params.id);
  if (hostel) {
    res.json(hostel);
  } else {
    res.status(404).json({ message: 'Hostel not found' });
  }
});

// Create hostel (admin)
app.post('/api/hostels', (req, res) => {
  const newHostel = {
    _id: Date.now().toString(),
    ...req.body
  };
  mockHostels.push(newHostel);
  res.status(201).json(newHostel);
});

// Update hostel (admin)
app.put('/api/hostels/:id', (req, res) => {
  const index = mockHostels.findIndex(h => h._id === req.params.id);
  if (index !== -1) {
    mockHostels[index] = { ...mockHostels[index], ...req.body, _id: req.params.id };
    res.json(mockHostels[index]);
  } else {
    res.status(404).json({ message: 'Hostel not found' });
  }
});

// Delete hostel (admin)
app.delete('/api/hostels/:id', (req, res) => {
  const index = mockHostels.findIndex(h => h._id === req.params.id);
  if (index !== -1) {
    mockHostels.splice(index, 1);
    res.json({ message: 'Hostel deleted' });
  } else {
    res.status(404).json({ message: 'Hostel not found' });
  }
});

// Import hostels (admin)
app.post('/api/hostels/import', (req, res) => {
  try {
    const { hostels } = req.body;
    if (!Array.isArray(hostels)) {
      return res.status(400).json({ message: 'Hostels must be an array' });
    }
    
    const newHostels = hostels.map(h => ({
      _id: Date.now().toString() + Math.random(),
      ...h,
      amenities: Array.isArray(h.amenities) ? h.amenities : (h.amenities ? h.amenities.split(',').map(a => a.trim()) : []),
      roomTypes: Array.isArray(h.roomTypes) ? h.roomTypes : (h.roomTypes ? h.roomTypes.split(',').map(r => ({ type: r.trim(), image: 'https://via.placeholder.com/150x100?text=' + r.trim().replace(/\s+/g, '+') })) : [])
    }));
    
    mockHostels.push(...newHostels);
    res.status(201).json({ message: 'Hostels imported', count: newHostels.length });
  } catch (err) {
    res.status(400).json({ message: 'Import failed: ' + err.message });
  }
});

// Payment endpoints
app.post('/api/payments/initiate', (req, res) => {
  res.json({
    message: 'Payment initiated',
    transactionId: Date.now().toString(),
    status: 'pending'
  });
});

app.post('/api/payments/mock/confirm', (req, res) => {
  res.json({
    message: 'Mock payment confirmed',
    status: 'success'
  });
});

app.get('/api/payments/history', (req, res) => {
  res.json([]);
});

// User profile
app.get('/api/users/profile', (req, res) => {
  res.json({ message: 'Profile endpoint' });
});

const PORT = process.env.PORT || 5001;

try {
  const server = app.listen(PORT, () => {
    console.log(`✅ Test server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err.message);
  });
} catch (err) {
  console.error('Failed to start server:', err.message);
  process.exit(1);
}

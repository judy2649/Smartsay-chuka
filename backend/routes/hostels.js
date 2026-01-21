const express = require('express');
const { getAllHostels, getHostelById, createHostel, updateHostel, addReview, importHostels, updateHostelImage, importHostelsFromData } = require('../controllers/hostelController');
const authMiddleware = require('../middleware/auth');
const adminGuard = require('../middleware/adminGuard');
const subscriptionGuard = require('../middleware/subscriptionGuard');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Mock data endpoint for testing
router.get('/test/mock', (req, res) => {
  const mockData = require('../utils/mockDatabase');
  res.json({ mockHostels: mockData.hostels });
});

// Get Chuka University hostel data template
router.get('/template/chuka-data', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, '../data/chuka-hostels.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    const chukhaHostels = JSON.parse(data);
    res.json({
      message: 'Chuka University hostel data template',
      dataSource: 'Chuka University Accommodation Portal',
      hostelsCount: chukhaHostels.hostels.length,
      ...chukhaHostels
    });
  } catch (error) {
    res.status(500).json({ message: 'Error loading hostel data template', error: error.message });
  }
});

// Public endpoints - no auth required
router.get('/', optionalAuth, subscriptionGuard, getAllHostels);
router.get('/:id', optionalAuth, subscriptionGuard, getHostelById);

// Admin only endpoints
router.post('/', authMiddleware, adminGuard, createHostel);
router.put('/:id', authMiddleware, adminGuard, updateHostel);
router.post('/:id/image', authMiddleware, adminGuard, updateHostelImage);
router.post('/import', authMiddleware, adminGuard, importHostels);
// Import hostels from JSON data (Chuka University hostels)
router.post('/import/from-data', authMiddleware, adminGuard, importHostelsFromData);

// Public reviews endpoint (authenticated users only)
router.post('/:id/review', authMiddleware, addReview);

module.exports = router;

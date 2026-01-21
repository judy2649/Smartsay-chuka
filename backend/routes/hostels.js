const express = require('express');
const { getAllHostels, getHostelById, createHostel, updateHostel, addReview, importHostels, updateHostelImage } = require('../controllers/hostelController');
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

// Public endpoints - no auth required
router.get('/', optionalAuth, subscriptionGuard, getAllHostels);
router.get('/:id', optionalAuth, subscriptionGuard, getHostelById);

// Admin only endpoints
router.post('/', authMiddleware, adminGuard, createHostel);
router.put('/:id', authMiddleware, adminGuard, updateHostel);
router.post('/:id/image', authMiddleware, adminGuard, updateHostelImage);
router.post('/import', authMiddleware, adminGuard, importHostels);

// Public reviews endpoint (authenticated users only)
router.post('/:id/review', authMiddleware, addReview);

module.exports = router;

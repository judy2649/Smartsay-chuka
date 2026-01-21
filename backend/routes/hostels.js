const express = require('express');
const { getAllHostels, getHostelById, createHostel, updateHostel, addReview, importHostels } = require('../controllers/hostelController');
const authMiddleware = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Mock data endpoint for testing
router.get('/test/mock', (req, res) => {
  const mockData = require('../utils/mockDatabase');
  res.json({ mockHostels: mockData.hostels });
});

router.get('/', optionalAuth, getAllHostels);
router.get('/:id', optionalAuth, getHostelById);
router.post('/', authMiddleware, createHostel);
router.put('/:id', authMiddleware, updateHostel);
router.post('/:id/review', authMiddleware, addReview);
// Admin bulk import
router.post('/import', authMiddleware, importHostels);

module.exports = router;

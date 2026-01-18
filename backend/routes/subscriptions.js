const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/status', authMiddleware, (req, res) => {
  res.json({ message: 'Get subscription status' });
});

module.exports = router;

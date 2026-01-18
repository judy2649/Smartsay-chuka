const express = require('express');
const { initiateMpesaPayment, handleMpesaCallback, getPaymentHistory, confirmMockPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/initiate', authMiddleware, initiateMpesaPayment);
router.post('/callback', handleMpesaCallback);
router.get('/history', authMiddleware, getPaymentHistory);
// Mock confirm endpoint for offline/testing
router.post('/mock/confirm', authMiddleware, confirmMockPayment);

module.exports = router;

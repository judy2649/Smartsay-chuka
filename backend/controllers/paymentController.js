const Payment = require('../models/Payment');
const User = require('../models/User');
const mpesaService = require('../utils/mpesaService');
const { _mock } = require('./authController');

exports.initiateMpesaPayment = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const amount = process.env.SUBSCRIPTION_FEE || 263;

    // Create payment record
    const payment = new Payment({
      userId: req.user.id,
      phoneNumber,
      amount,
      status: 'pending'
    });

    await payment.save();

    // Initiate M-Pesa STK push
    const mpesaResponse = await mpesaService.initiateSTKPush(
      phoneNumber,
      amount,
      `SMARTSTAY-${payment._id}`
    );

    if (mpesaResponse.ResponseCode === '0') {
      res.json({
        message: 'STK push initiated successfully',
        paymentId: payment._id,
        mpesaResponse
      });
    } else {
      res.status(400).json({
        message: 'Failed to initiate payment',
        mpesaResponse
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.handleMpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;

    const accountRef = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    // Find payment
    const payment = await Payment.findOne({ transactionId: accountRef });

    if (resultCode === 0) {
      // Payment successful
      const metadata = stkCallback.CallbackMetadata.Item;
      const receiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;

      if (payment) {
        payment.status = 'completed';
        payment.mpesaReceiptNumber = receiptNumber;
        await payment.save();

        // Update user subscription
        const user = await User.findById(payment.userId);
        if (user) {
          user.isSubscribed = true;
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30); // 30 days subscription
          user.subscriptionExpiryDate = expiryDate;
          await user.save();
        }
      }

      res.json({ ResultCode: 0, ResultDesc: 'Success' });
    } else {
      // Payment failed
      if (payment) {
        payment.status = 'failed';
        await payment.save();
      }

      res.json({ ResultCode: 0, ResultDesc: 'Success' });
    }
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.confirmMockPayment = async (req, res) => {
  try {
    // If running with mock users, update the mock user's subscription
    if (_mock && _mock.findMockUserById) {
      const id = req.user._id || req.user.id;
      const updated = _mock.updateMockUserSubscription(id, true, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      if (updated) {
        return res.json({ message: 'Mock payment confirmed, subscription activated' });
      }
    }

    // Fallback: update DB-backed user
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        user.isSubscribed = true;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        user.subscriptionExpiryDate = expiryDate;
        await user.save();
        return res.json({ message: 'Subscription activated' });
      }
    } catch (dbErr) {
      console.error('Failed to update DB user subscription:', dbErr);
    }

    res.status(400).json({ message: 'Unable to confirm payment' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Query payment status and verify if payment was completed
exports.verifyPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Find payment in database
    let payment;
    try {
      payment = await Payment.findByPk(paymentId);
    } catch (err) {
      console.log('Database query error, checking mock data');
    }

    if (!payment) {
      // Check mock database if available
      if (_mock && _mock.findPaymentById) {
        const mockPayment = _mock.findPaymentById(paymentId);
        if (mockPayment) {
          return res.json({
            success: true,
            paymentId,
            status: mockPayment.status,
            amount: mockPayment.amount,
            mpesaReceiptNumber: mockPayment.mpesaReceiptNumber,
            isPaid: mockPayment.status === 'completed',
            createdAt: mockPayment.createdAt,
            source: 'mock'
          });
        }
      }
      return res.status(404).json({ message: 'Payment not found' });
    }

    // If payment exists in database, check its status
    const isPaid = payment.status === 'completed';

    res.json({
      success: true,
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount,
      mpesaReceiptNumber: payment.mpesaReceiptNumber || null,
      phoneNumber: payment.phoneNumber,
      isPaid,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      source: 'database'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if user has paid for subscription (verify subscription status)
exports.checkSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Try database first
    let user;
    try {
      user = await User.findByPk(userId);
    } catch (err) {
      console.log('Database query error, checking mock data');
    }

    if (!user) {
      // Check mock database
      if (_mock && _mock.findMockUserById) {
        const mockUser = _mock.findMockUserById(userId);
        if (mockUser) {
          const isActive = mockUser.isSubscribed && new Date(mockUser.subscriptionExpiryDate) > new Date();
          return res.json({
            userId,
            isSubscribed: mockUser.isSubscribed,
            isActive,
            subscriptionExpiryDate: mockUser.subscriptionExpiryDate,
            daysRemaining: isActive ? Math.ceil((new Date(mockUser.subscriptionExpiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
            source: 'mock'
          });
        }
      }
      return res.status(404).json({ message: 'User not found' });
    }

    // User found in database
    const isActive = user.isSubscribed && user.subscriptionExpiryDate && new Date(user.subscriptionExpiryDate) > new Date();
    const daysRemaining = isActive ? Math.ceil((new Date(user.subscriptionExpiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

    res.json({
      userId: user.id,
      isSubscribed: user.isSubscribed,
      isActive,
      subscriptionExpiryDate: user.subscriptionExpiryDate,
      daysRemaining,
      source: 'database'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent payments for verification
exports.getRecentPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit || 10;

    // Try database first
    let payments = [];
    try {
      payments = await Payment.findAll({
        where: { userId },
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });
    } catch (err) {
      console.log('Database query error, checking mock data');
    }

    if (payments.length === 0) {
      // Check mock database
      if (_mock && _mock.getPaymentsByUserId) {
        payments = _mock.getPaymentsByUserId(userId).slice(0, limit);
        if (payments.length > 0) {
          return res.json({
            payments,
            source: 'mock'
          });
        }
      }
    }

    res.json({
      payments: payments.map(p => ({
        paymentId: p.id,
        amount: p.amount,
        status: p.status,
        mpesaReceiptNumber: p.mpesaReceiptNumber,
        phoneNumber: p.phoneNumber,
        createdAt: p.createdAt,
        isPaid: p.status === 'completed'
      })),
      source: payments.length > 0 ? 'database' : 'mock'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

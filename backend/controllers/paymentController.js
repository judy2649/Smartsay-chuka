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

// Mock endpoint to confirm payment in offline mode
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

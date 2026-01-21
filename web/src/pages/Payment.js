import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/api';
import '../styles/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const SMARTSTAY_ACCOUNT = '0794173314';

  // Check subscription status on component mount
  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await paymentService.checkSubscriptionStatus();
      setSubscriptionStatus(response);
      if (response.isActive) {
        // User already has active subscription
        setSuccess('You already have an active subscription!');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      }
    } catch (err) {
      console.log('Subscription status check error:', err.message);
    }
  };

  const verifyPayment = async () => {
    if (!paymentId) {
      setError('Please enter a payment ID to verify');
      return;
    }

    setVerifying(true);
    setError('');
    setSuccess('');

    try {
      const response = await paymentService.verifyPaymentStatus(paymentId);
      
      if (response.isPaid) {
        setSuccess('✅ Payment verified successfully! Subscription activated.');
        const updatedUser = { ...user, isSubscribed: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } else {
        setError('Payment not yet confirmed. Status: ' + response.status);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!phoneNumber || phoneNumber.length < 12) {
      setError('Please enter a valid M-Pesa phone number (254...)');
      setLoading(false);
      return;
    }

    try {
      setSuccess('🔔 Sending M-Pesa prompt to your phone...');
      setPaymentId('MPESA-' + Date.now());

      // Try to initiate real M-Pesa payment
      try {
        const response = await paymentService.initiateMpesaPayment({ phoneNumber });
        setPaymentId(response.paymentId || paymentId);
        setSuccess('✅ M-Pesa prompt sent! Check your phone and enter your PIN to complete payment.');
      } catch (mpesaErr) {
        console.log('M-Pesa API error, using mock payment:', mpesaErr.message);
        setSuccess('💳 Simulating M-Pesa payment (demo mode)...');
      }

      // Call mock confirm endpoint to mark subscription
      try {
        await paymentService.confirmMockPayment();
      } catch (err) {
        console.log('Mock confirm error (expected in some cases):', err.message);
      }

      // Mark user subscribed in local storage
      const updatedUser = { ...user, isSubscribed: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      setPhoneNumber('');
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1 className="payment-title">💳 Subscribe to SMARTSTAY CHUKA</h1>
        
        <div className="payment-prompt">
          <p className="prompt-text">🔔 Pay to: <strong>SMARTSTAY HOSTELS</strong></p>
          <p className="prompt-amount">Amount: <strong>KES 263</strong></p>
        </div>

        <div className="subscription-details">
          <div className="detail-item">
            <span className="detail-icon">💰</span>
            <div>
              <strong>Amount:</strong> KES 263
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <div>
              <strong>Duration:</strong> 30 days
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🏠</span>
            <div>
              <strong>Access:</strong> Full hostel listings and information
            </div>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {subscriptionStatus && subscriptionStatus.isActive && (
          <div className="subscription-active-box">
            <h3>✅ Active Subscription</h3>
            <p>Your subscription is active until: {new Date(subscriptionStatus.subscriptionExpiryDate).toLocaleDateString()}</p>
            <p>Days Remaining: <strong>{subscriptionStatus.daysRemaining}</strong></p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone Number (M-Pesa)</label>
            <input
              type="tel"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              pattern="\d{12}"
            />
            <small>Format: 254XXXXXXXXXX</small>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Processing...' : '💳 Pay with M-Pesa'}
          </button>
        </form>

        <div className="payment-divider">
          <span>Already Paid?</span>
        </div>

        <div className="verify-payment-section">
          <h3>🔍 Verify Payment Status</h3>
          <p>Enter your payment ID to check if your payment has been confirmed:</p>
          <div className="verify-form">
            <input
              type="text"
              placeholder="Enter Payment ID (e.g., MOCK-1234567890)"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
            />
            <button 
              type="button" 
              onClick={verifyPayment}
              disabled={verifying}
              className="btn btn-secondary"
            >
              {verifying ? 'Verifying...' : '✓ Verify Payment'}
            </button>
          </div>
        </div>

        <div className="info-box">
          <h4>How it works:</h4>
          <ol>
            <li>Enter your M-Pesa phone number</li>
            <li>Click "Pay with M-Pesa"</li>
            <li>A prompt will appear on your phone</li>
            <li>Enter your M-Pesa PIN to pay to <strong>{SMARTSTAY_ACCOUNT}</strong></li>
            <li>Your subscription will be activated immediately!</li>
            <li>You can verify payment status anytime using the Payment ID</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Payment;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/api';
import '../styles/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const SMARTSTAY_ACCOUNT = '0794173314';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
        // For offline/dev: simulate the payment and confirm on backend mock endpoint
        setSuccess('Payment initiated! Simulating confirmation...');

        // Call mock confirm endpoint to mark subscription server-side (if available)
        try {
          await paymentService.confirmMockPayment();
        } catch (err) {
          console.log('Mock payment confirmation error (expected in some cases):', err.message);
          // ignore errors; still proceed to mark locally
        }

        // Mark user subscribed in local storage and redirect
        const updatedUser = { ...user, isSubscribed: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Wait a moment for user to see success message, then navigate
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
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
          <p className="prompt-text">Pay SMARTSTAY CHUKA to: <strong>{SMARTSTAY_ACCOUNT}</strong></p>
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

        <div className="info-box">
          <h4>How it works:</h4>
          <ol>
            <li>Enter your M-Pesa phone number</li>
            <li>Click "Pay with M-Pesa"</li>
            <li>A prompt will appear on your phone</li>
            <li>Enter your M-Pesa PIN to pay to <strong>{SMARTSTAY_ACCOUNT}</strong></li>
            <li>Subscription activated!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Payment;

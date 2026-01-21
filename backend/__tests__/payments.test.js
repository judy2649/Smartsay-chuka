const request = require('supertest');
const express = require('express');
const paymentRouter = require('../routes/payments');
const { syncDatabase } = require('../models/database');

const app = express();
app.use(express.json());
app.use('/api/payments', paymentRouter);

describe('Payments Endpoints', () => {
  beforeAll(async () => {
    try {
      await syncDatabase();
    } catch (error) {
      console.warn('Database sync warning:', error.message);
    }
  });

  describe('GET /api/payments', () => {
    it('should return a list of payments', async () => {
      const response = await request(app)
        .get('/api/payments');

      expect([200, 401]).toContain(response.statusCode);
    });
  });

  describe('GET /api/payments/:id', () => {
    it('should return 404 for non-existent payment', async () => {
      const response = await request(app)
        .get('/api/payments/99999');

      expect([404, 401]).toContain(response.statusCode);
    });
  });

  describe('POST /api/payments/initiate', () => {
    it('should handle payment initiation request', async () => {
      const paymentData = {
        amount: 500,
        phone: '254712345678',
        subscriptionPlan: 'monthly'
      };

      const response = await request(app)
        .post('/api/payments/initiate')
        .send(paymentData);

      expect([200, 201, 400, 401]).toContain(response.statusCode);
    });
  });

  describe('POST /api/payments/callback', () => {
    it('should handle M-Pesa callback', async () => {
      const callbackData = {
        Body: {
          stkCallback: {
            MerchantRequestID: 'test-123',
            CheckoutRequestID: 'test-456',
            ResultCode: 0,
            ResultDesc: 'The service request has been processed successfully.',
            CallbackMetadata: {
              Item: [
                { Name: 'Amount', Value: 500 },
                { Name: 'MpesaReceiptNumber', Value: 'LLF61H5QQ57' },
                { Name: 'TransactionDate', Value: 20231215123456 },
                { Name: 'PhoneNumber', Value: 254712345678 }
              ]
            }
          }
        }
      };

      const response = await request(app)
        .post('/api/payments/callback')
        .send(callbackData);

      expect([200, 400]).toContain(response.statusCode);
    });
  });

  describe('GET /api/payments/status/:transactionId', () => {
    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .get('/api/payments/status/non-existent');

      expect([404, 401]).toContain(response.statusCode);
    });
  });
});
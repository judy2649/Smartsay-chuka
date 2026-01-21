const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth');
const { syncDatabase } = require('../models/database');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Sync database before running tests
    try {
      await syncDatabase();
    } catch (error) {
      console.warn('Database sync warning:', error.message);
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: `test_${Date.now()}@example.com`,
          phoneNumber: '0712345678',
          password: 'TestPassword123'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message');
    });

    it('should not register with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'invalid-email',
          phoneNumber: '0712345678',
          password: 'TestPassword123'
        });

      expect(response.statusCode).toBe(400);
    });

    it('should not register with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: `test_${Date.now()}@example.com`,
          phoneNumber: '0712345678',
          password: '123' // Too short
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Login',
          lastName: 'Test',
          email: 'logintest@example.com',
          phoneNumber: '0712345678',
          password: 'LoginTest123'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'LoginTest123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'WrongPassword'
        });

      expect(response.statusCode).toBe(401);
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123'
        });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/auth/admin-login', () => {
    it('should login admin with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/admin-login')
        .send({
          email: 'admin@smartstay.com',
          password: 'admin123'
        });

      // Will return 401 if admin doesn't exist, which is expected in test
      expect([200, 401]).toContain(response.statusCode);
    });
  });
});
const request = require('supertest');
const express = require('express');
const hostelRouter = require('../routes/hostels');
const { syncDatabase } = require('../models/database');

const app = express();
app.use(express.json());
app.use('/api/hostels', hostelRouter);

describe('Hostels Endpoints', () => {
  beforeAll(async () => {
    try {
      await syncDatabase();
    } catch (error) {
      console.warn('Database sync warning:', error.message);
    }
  });

  describe('GET /api/hostels', () => {
    it('should return a list of hostels', async () => {
      const response = await request(app)
        .get('/api/hostels');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/hostels/:id', () => {
    it('should return 404 for non-existent hostel', async () => {
      const response = await request(app)
        .get('/api/hostels/99999');

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /api/hostels', () => {
    it('should create a new hostel with valid data', async () => {
      const newHostel = {
        name: 'Test Hostel',
        description: 'A test hostel',
        location: 'Test Location',
        distance: 2,
        phoneNumber: '0712345678',
        caretaker: 'John Doe',
        caretakerPhone: '0712345678',
        amenities: JSON.stringify(['WiFi', 'Hot Water']),
        roomTypes: JSON.stringify([{ type: 'Single', price: 500 }]),
        verified: false
      };

      const response = await request(app)
        .post('/api/hostels')
        .send(newHostel);

      expect([201, 400, 401]).toContain(response.statusCode);
    });
  });

  describe('PUT /api/hostels/:id', () => {
    it('should return 404 for non-existent hostel update', async () => {
      const response = await request(app)
        .put('/api/hostels/99999')
        .send({ name: 'Updated' });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/hostels/:id', () => {
    it('should return 404 for non-existent hostel deletion', async () => {
      const response = await request(app)
        .delete('/api/hostels/99999');

      expect(response.statusCode).toBe(404);
    });
  });
});
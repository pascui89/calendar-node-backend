const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { createUser, renewToken } = require('../controllers/auth');
require('dotenv').config();

jest.mock('../controllers/auth');

const authRoutes = require('../routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for POST /api/auth with invalid data', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({ email: 'invalidemail', password: 'short' });
    expect(res.statusCode).toEqual(400);
  });

  it('should return 200 for POST /api/auth/new with valid data', async () => {
    createUser.mockImplementation((req, res) => res.status(200).json({ msg: 'User created' }));
    const res = await request(app)
      .post('/api/auth/new')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toBe('User created');
  });

  it('should return 401 for POST /api/auth/renew without token', async () => {
    renewToken.mockImplementation((req, res) => res.status(401).json({ msg: 'No token provided' }));
    const res = await request(app)
      .post('/api/auth/renew');
    expect(res.statusCode).toEqual(401);
  });
});
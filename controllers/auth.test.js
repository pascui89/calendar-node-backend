const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { login, createUser, renewToken } = require('../controllers/auth');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');
require('dotenv').config();

jest.mock('../models/User');
jest.mock('../helpers/jwt', () => ({
  generateJWT: jest.fn().mockResolvedValue('mocked-token')
}));

const app = express();
app.use(express.json());

app.post('/api/auth/login', login);
app.post('/api/auth/new', createUser);
app.get('/api/auth/renew', renewToken);

describe('Auth Controller', () => {
  let userId;

  beforeAll(async () => {
    userId = '123';
  });

  it('should login a user with valid credentials', async () => {
    const user = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      password: bcrypt.hashSync('password123', 10)
    };
    User.findOne.mockResolvedValue(user);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.result).toBe(true);
    expect(res.body.uid).toBe(user.id);
    expect(res.body.name).toBe(user.name);
    expect(res.body.token).toBe('mocked-token');
  });

  it('should not login a user with invalid email', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.result).toBe(false);
    expect(res.body.message).toBe('The user does not exist');
  });

  it('should not login a user with invalid password', async () => {
    const user = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      password: bcrypt.hashSync('password123', 10)
    };
    User.findOne.mockResolvedValue(user);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toEqual(401);
    expect(res.body.result).toBe(false);
    expect(res.body.message).toBe('The password is incorrect');
  });

  it('should not create a user if email already exists', async () => {
    const user = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      password: bcrypt.hashSync('password123', 10)
    };
    User.findOne.mockResolvedValue(user);

    const res = await request(app)
      .post('/api/auth/new')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.result).toBe(false);
    expect(res.body.message).toBe('The user already exists');
  });

  it('should renew a token', async () => {
    const res = await request(app)
      .get('/api/auth/renew')
      .set('x-token', 'mocked-token');

    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(true);
    expect(res.body.token).toBe('mocked-token');
  });
});
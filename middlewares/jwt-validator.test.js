const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { validateJWT } = require('../middlewares/jwt-validator');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/protected', validateJWT, (req, res) => {
  res.json({
    result: true,
    message: 'Access granted',
    uid: req.uid,
    name: req.name
  });
});

describe('JWT Validator Middleware', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/protected');
    expect(res.statusCode).toEqual(401);
    expect(res.body.result).toBe(false);
    expect(res.body.message).toBe('No token in the request');
  });

  it('should return 401 if an invalid token is provided', async () => {
    const res = await request(app)
      .get('/protected')
      .set('x-token', 'invalidtoken');
    expect(res.statusCode).toEqual(401);
    expect(res.body.result).toBe(false);
    expect(res.body.message).toBe('Invalid token');
  });

  it('should grant access if a valid token is provided', async () => {
    const token = jwt.sign({ uid: '123', name: 'Test User' }, process.env.SECRET_JWT_SEED, { expiresIn: '1h' });
    const res = await request(app)
      .get('/protected')
      .set('x-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(true);
    expect(res.body.message).toBe('Access granted');
    expect(res.body.uid).toBe('123');
    expect(res.body.name).toBe('Test User');
  });
});
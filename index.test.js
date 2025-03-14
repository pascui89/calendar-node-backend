const request = require('supertest');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});

describe('GET /api/auth', () => {
  it('should return 404 Not Found', async () => {
    const res = await request(app).get('/api/auth');
    expect(res.statusCode).toEqual(404);
  });
});
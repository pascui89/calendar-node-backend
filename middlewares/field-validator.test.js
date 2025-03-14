const express = require('express');
const request = require('supertest');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');

const app = express();
app.use(express.json());

app.post('/test', [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').isLength({ min: 6 }),
  validateFields
], (req, res) => {
  res.json({
    result: true,
    message: 'Validation passed'
  });
});

describe('Field Validator Middleware', () => {
  it('should return 400 if validation fails', async () => {
    const res = await request(app)
      .post('/test')
      .send({ email: 'invalidemail', password: 'short' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.result).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.email).toBeDefined();
    expect(res.body.errors.password).toBeDefined();
  });

  it('should pass validation if data is valid', async () => {
    const res = await request(app)
      .post('/test')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(true);
    expect(res.body.message).toBe('Validation passed');
  });
});
require('dotenv').config();
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const Event = require('../models/Event');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

jest.mock('../models/Event');
jest.mock('../models/User');
jest.mock('../middlewares/jwt-validator', () => ({
    validateJWT: (req, res, next) => {
        req.uid = '123'; // Mock user ID
        next();
    }
}));
jest.mock('../helpers/jwt', () => ({
    generateJWT: jest.fn().mockResolvedValue('mocked-token')
}));

const app = express();
app.use(express.json());

app.get('/api/events', getEvents);
app.post('/api/events', createEvent);
app.put('/api/events/:id', updateEvent);
app.delete('/api/events/:id', deleteEvent);

describe('Events Controller', () => {
  let token;
  let userId;

  beforeAll(async () => {
    if (!process.env.DB_CNN) {
      throw new Error('DB_CNN is not defined in the environment variables');
    }

    await mongoose.connect(process.env.DB_CNN);

    userId = '123';
    token = await generateJWT(userId, 'Test User');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should get events', async () => {
    Event.find.mockReturnValue({ 
        populate: jest.fn().mockResolvedValue([{ title: 'Test Event', user: userId }]) 
    });
    User.findById.mockResolvedValue({ id: userId, name: 'Test User' });

    const res = await request(app)
      .get('/api/events')
      .set('x-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(true);
    expect(res.body.events).toBeDefined();
    expect(res.body.token).toBe(token);
  });

  it('should create an event', async () => {
    const event = { title: 'Test Event', start: new Date(), end: new Date(), user: userId };
    Event.prototype.save.mockResolvedValue(event);
    User.findById.mockResolvedValue({ id: userId, name: 'Test User' });

    const res = await request(app)
      .post('/api/events')
      .set('x-token', token)
      .send(event);

    expect(res.statusCode).toEqual(201);
    expect(res.body.result).toBe(true);
    expect(res.body.event).toBeDefined();
    expect(res.body.token).toBe(token);
  });

  it('should update an event', async () => {
    const event = { title: 'Updated Event', start: new Date(), end: new Date(), user: userId };
    Event.findByIdAndUpdate.mockReturnValue({ 
        populate: jest.fn().mockResolvedValue(event) 
    });
    User.findById.mockResolvedValue(event);

    const res = await request(app)
      .put('/api/events/1')
      .set('x-token', token)
      .send(event);

    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(true);
    expect(res.body.eventUpdated).toBeDefined();
    expect(res.body.token).toBe(token);
  });

  it('should delete an event', async () => {
    const event = { title: 'Test Event', user: userId };
    Event.findByIdAndDelete.mockResolvedValue(event);
    User.findById.mockResolvedValue({ id: userId, name: 'Test User' });

    const res = await request(app)
      .delete('/api/events/1')
      .set('x-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(true);
    expect(res.body.msg).toBe('Event deleted');
    expect(res.body.token).toBe(token);
  });
});
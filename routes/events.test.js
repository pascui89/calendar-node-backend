const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
require('dotenv').config();

jest.mock('../controllers/events');
jest.mock('../middlewares/jwt-validator', () => ({
    validateJWT: (req, res, next) => next()
}));

const eventsRoutes = require('../routes/events');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/events', eventsRoutes);

describe('Events Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 for GET /api/events', async () => {
    getEvents.mockImplementation((req, res) => res.status(200).json({ msg: 'Events fetched' }));
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toBe('Events fetched');
  });

  it('should return 400 for POST /api/events with invalid data', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ title: '', start: 'invalid-date', end: 'invalid-date' });
    expect(res.statusCode).toEqual(400);
  });

  it('should return 200 for POST /api/events with valid data', async () => {
    createEvent.mockImplementation((req, res) => res.status(200).json({ msg: 'Event created' }));
    const res = await request(app)
      .post('/api/events')
      .send({ title: 'Test Event', start: '2025-03-14T10:00:00Z', end: '2025-03-14T12:00:00Z' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toBe('Event created');
  });

  it('should return 200 for PUT /api/events/:id with valid data', async () => {
    updateEvent.mockImplementation((req, res) => res.status(200).json({ msg: 'Event updated' }));
    const res = await request(app)
      .put('/api/events/1')
      .send({ title: 'Updated Event', start: '2025-03-14T10:00:00Z', end: '2025-03-14T12:00:00Z' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toBe('Event updated');
  });

  it('should return 200 for DELETE /api/events/:id', async () => {
    deleteEvent.mockImplementation((req, res) => res.status(200).json({ msg: 'Event deleted' }));
    const res = await request(app).delete('/api/events/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toBe('Event deleted');
  });
});
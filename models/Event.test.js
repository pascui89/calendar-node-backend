require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

describe('Event Model Test', () => {
  let createdEventsIds = [];
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_CNN);
  });

  afterAll(async () => {
    await Event.deleteMany({ _id: { $in: createdEventsIds } });
    createdEventsIds = [];
    await mongoose.connection.close();
  });

  it('should create & save an event successfully', async () => {
    const validEvent = new Event({
      title: 'Test Event',
      notes: 'This is a test event',
      start: new Date('2025-03-14T10:00:00Z'),
      end: new Date('2025-03-14T12:00:00Z'),
      user: new mongoose.Types.ObjectId(),
    });
    const savedEvent = await validEvent.save();
    createdEventsIds.push(savedEvent._id);
    expect(savedEvent._id).toBeDefined();
    expect(savedEvent.title).toBe(validEvent.title);
    expect(savedEvent.notes).toBe(validEvent.notes);
    expect(savedEvent.start).toBe(validEvent.start);
    expect(savedEvent.end).toBe(validEvent.end);
    expect(savedEvent.user).toBe(validEvent.user);
  });

  it('should fail to create an event without required fields', async () => {
    const invalidEvent = new Event({
      notes: 'This is a test event',
    });
    let err;
    try {
      await invalidEvent.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
    expect(err.errors.start).toBeDefined();
    expect(err.errors.end).toBeDefined();
    expect(err.errors.user).toBeDefined();
  });
});
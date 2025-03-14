require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

describe('User Model Test', () => {
  let createdUserIds = [];
  beforeAll(async () => {
    if (!process.env.DB_CNN) {
      throw new Error('DB_CNN is not defined in the environment variables');
    }

    await mongoose.connect(process.env.DB_CNN);
  });

  afterAll(async () => {
    await User.deleteMany({ _id: { $in: createdUserIds } });
    createdUserIds = [];
    await mongoose.connection.close();
  });

  it('should create & save a user successfully', async () => {
    const validUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    const savedUser = await validUser.save();
    createdUserIds.push(savedUser._id);
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(validUser.name);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).toBe(validUser.password);
  });

  it('should fail to create a user without required fields', async () => {
    const invalidUser = new User({
      email: 'test@example.com',
    });
    let err;
    try {
      await invalidUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('should fail to create a user with duplicate email', async () => {
    const user1 = new User({
      name: 'Test User 1',
      email: 'duplicate@example.com',
      password: 'password123',
    });
    const savedUser = await user1.save();
    createdUserIds.push(savedUser._id);

    const user2 = new User({
      name: 'Test User 2',
      email: 'duplicate@example.com',
      password: 'password123',
    });
    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.mongo.MongoServerError);
    expect(err.code).toBe(11000); // Duplicate key error code
  });
});
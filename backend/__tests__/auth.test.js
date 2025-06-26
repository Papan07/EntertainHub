import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import { authRoutes } from '../routes/index.js';
import { User } from '../models/index.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test database connection
const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/entertainhub_test';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    const validUserData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User'
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(validUserData.email);
      expect(response.body.data.user.username).toBe(validUserData.username);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should return error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return error for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return error for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return error for duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          username: 'differentuser'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User'
    };

    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with email successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: userData.email,
          password: userData.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should login with username successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: userData.username,
          password: userData.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe(userData.username);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: userData.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return error for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'nonexistent@example.com',
          password: userData.password
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return error for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: userData.email
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create and login user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User'
        });

      authToken = registerResponse.body.data.token;
      userId = registerResponse.body.data.user._id;
    });

    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user._id).toBe(userId);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import { movieRoutes, authRoutes } from '../routes/index.js';
import { Movie, User } from '../models/index.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Test database connection
const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/entertainhub_test';

describe('Movie Routes', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up database
    await Movie.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User'
      });

    adminUser = adminResponse.body.data.user;
    adminToken = adminResponse.body.data.token;

    // Update user role to admin
    await User.findByIdAndUpdate(adminUser._id, { role: 'admin' });

    // Create regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'user',
        email: 'user@example.com',
        password: 'User123!',
        firstName: 'Regular',
        lastName: 'User'
      });

    regularUser = userResponse.body.data.user;
    userToken = userResponse.body.data.token;
  });

  describe('GET /api/movies', () => {
    beforeEach(async () => {
      // Create test movies
      await Movie.create([
        {
          title: 'Test Movie 1',
          overview: 'This is a test movie description',
          releaseDate: new Date('2023-01-01'),
          voteAverage: 8.5,
          genres: [{ id: 1, name: 'Action' }]
        },
        {
          title: 'Test Movie 2',
          overview: 'Another test movie description',
          releaseDate: new Date('2023-02-01'),
          voteAverage: 7.2,
          genres: [{ id: 2, name: 'Comedy' }]
        }
      ]);
    });

    it('should get all movies successfully', async () => {
      const response = await request(app)
        .get('/api/movies');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movies).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter movies by genre', async () => {
      const response = await request(app)
        .get('/api/movies?genre=Action');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movies).toHaveLength(1);
      expect(response.body.data.movies[0].title).toBe('Test Movie 1');
    });

    it('should paginate movies correctly', async () => {
      const response = await request(app)
        .get('/api/movies?page=1&limit=1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movies).toHaveLength(1);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });

    it('should sort movies by rating', async () => {
      const response = await request(app)
        .get('/api/movies?sortBy=voteAverage&sortOrder=desc');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movies[0].voteAverage).toBe(8.5);
      expect(response.body.data.movies[1].voteAverage).toBe(7.2);
    });
  });

  describe('GET /api/movies/search', () => {
    beforeEach(async () => {
      await Movie.create({
        title: 'Searchable Movie',
        overview: 'This movie can be found by search',
        releaseDate: new Date('2023-01-01'),
        voteAverage: 8.0,
        genres: [{ id: 1, name: 'Drama' }]
      });
    });

    it('should search movies by title', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=Searchable');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movies).toHaveLength(1);
      expect(response.body.data.movies[0].title).toBe('Searchable Movie');
    });

    it('should return empty results for non-matching search', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=NonExistent');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movies).toHaveLength(0);
    });

    it('should return error for missing search query', async () => {
      const response = await request(app)
        .get('/api/movies/search');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/movies', () => {
    const validMovieData = {
      title: 'New Test Movie',
      overview: 'This is a new test movie',
      releaseDate: '2023-12-01',
      voteAverage: 9.0,
      genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }]
    };

    it('should create movie successfully as admin', async () => {
      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validMovieData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movie.title).toBe(validMovieData.title);
      expect(response.body.data.movie.addedBy).toBe(adminUser._id);
    });

    it('should return error for non-admin user', async () => {
      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validMovieData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Admin access required');
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .post('/api/movies')
        .send(validMovieData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return error for invalid movie data', async () => {
      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test'
          // Missing required fields
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/movies/:id', () => {
    let movieId;

    beforeEach(async () => {
      const movie = await Movie.create({
        title: 'Test Movie',
        overview: 'Test movie description',
        releaseDate: new Date('2023-01-01'),
        voteAverage: 8.0,
        genres: [{ id: 1, name: 'Drama' }]
      });
      movieId = movie._id;
    });

    it('should get movie by ID successfully', async () => {
      const response = await request(app)
        .get(`/api/movies/${movieId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movie.title).toBe('Test Movie');
      expect(response.body.data.movie.viewCount).toBe(1); // Should increment view count
    });

    it('should return error for invalid movie ID', async () => {
      const response = await request(app)
        .get('/api/movies/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return error for non-existent movie', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/movies/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Movie not found');
    });
  });

  describe('PUT /api/movies/:id', () => {
    let movieId;

    beforeEach(async () => {
      const movie = await Movie.create({
        title: 'Test Movie',
        overview: 'Test movie description',
        releaseDate: new Date('2023-01-01'),
        voteAverage: 8.0,
        genres: [{ id: 1, name: 'Drama' }]
      });
      movieId = movie._id;
    });

    it('should update movie successfully as admin', async () => {
      const updateData = {
        title: 'Updated Movie Title',
        voteAverage: 9.5
      };

      const response = await request(app)
        .put(`/api/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.movie.title).toBe(updateData.title);
      expect(response.body.data.movie.voteAverage).toBe(updateData.voteAverage);
    });

    it('should return error for non-admin user', async () => {
      const response = await request(app)
        .put(`/api/movies/${movieId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/movies/:id', () => {
    let movieId;

    beforeEach(async () => {
      const movie = await Movie.create({
        title: 'Test Movie',
        overview: 'Test movie description',
        releaseDate: new Date('2023-01-01'),
        voteAverage: 8.0,
        genres: [{ id: 1, name: 'Drama' }]
      });
      movieId = movie._id;
    });

    it('should delete movie successfully as admin', async () => {
      const response = await request(app)
        .delete(`/api/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Movie deleted successfully');

      // Verify movie is deleted
      const deletedMovie = await Movie.findById(movieId);
      expect(deletedMovie).toBeNull();
    });

    it('should return error for non-admin user', async () => {
      const response = await request(app)
        .delete(`/api/movies/${movieId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});

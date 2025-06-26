// Jest setup file for environment variables and global test configuration

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_SECRET = 'test-refresh-jwt-secret-key';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.MONGODB_TEST_URI = 'mongodb://localhost:27017/entertainhub_test';

// Increase timeout for database operations
jest.setTimeout(30000);

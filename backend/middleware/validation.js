import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and cannot exceed 50 characters'),
    
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and cannot exceed 50 characters'),
    
  handleValidationErrors
];

export const validateUserLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  handleValidationErrors
];

// Movie validation rules
export const validateMovieCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Movie title is required and cannot exceed 200 characters'),
    
  body('overview')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Movie overview must be between 10 and 2000 characters'),
    
  body('releaseDate')
    .isISO8601()
    .withMessage('Please provide a valid release date'),
    
  body('voteAverage')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Vote average must be between 0 and 10'),
    
  body('runtime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Runtime must be a positive number'),
    
  body('genres')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
    
  body('genres.*.name')
    .trim()
    .notEmpty()
    .withMessage('Genre name is required'),
    
  handleValidationErrors
];

export const validateMovieUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Movie title cannot exceed 200 characters'),
    
  body('overview')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Movie overview must be between 10 and 2000 characters'),
    
  body('releaseDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid release date'),
    
  body('voteAverage')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Vote average must be between 0 and 10'),
    
  body('runtime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Runtime must be a positive number'),
    
  handleValidationErrors
];

// Review validation rules
export const validateReviewCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Review title is required and cannot exceed 100 characters'),
    
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review content must be between 10 and 2000 characters'),
    
  body('rating')
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating must be between 1 and 10'),
    
  handleValidationErrors
];

export const validateReviewUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Review title cannot exceed 100 characters'),
    
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review content must be between 10 and 2000 characters'),
    
  body('rating')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating must be between 1 and 10'),
    
  handleValidationErrors
];

// Watchlist validation rules
export const validateWatchlistCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Watchlist name is required and cannot exceed 100 characters'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
    
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),
    
  handleValidationErrors
];

// Parameter validation
export const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID format`),
    
  handleValidationErrors
];

// Query validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  handleValidationErrors
];

export const validateMovieQuery = [
  query('genre')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Genre cannot be empty'),
    
  query('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Year must be a valid year'),
    
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
    
  query('sortBy')
    .optional()
    .isIn(['title', 'releaseDate', 'voteAverage', 'popularity', 'createdAt'])
    .withMessage('Invalid sort field'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
    
  ...validatePagination
];

export const validateSearchQuery = [
  query('q')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query is required and cannot exceed 100 characters'),
    
  ...validatePagination
];

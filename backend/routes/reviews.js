import express from 'express';
import { Review, Movie, User } from '../models/index.js';
import { authenticateToken, requireOwnershipOrAdmin } from '../middleware/auth.js';
import { 
  validateReviewCreation, 
  validateReviewUpdate, 
  validateObjectId,
  validatePagination 
} from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get all reviews with pagination
// @access  Public
router.get('/', validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20, movieId, userId, status = 'approved' } = req.query;

    // Build filter
    const filter = { status };
    if (movieId) filter.movie = movieId;
    if (userId) filter.user = userId;

    const reviews = await Review.find(filter)
      .populate('user', 'username firstName lastName avatar')
      .populate('movie', 'title posterPath releaseDate')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/movie/:movieId
// @desc    Get reviews for a specific movie
// @access  Public
router.get('/movie/:movieId', validateObjectId('movieId'), validatePagination, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const reviews = await Review.getMovieReviews(movieId, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder: sortOrder === 'asc' ? 1 : -1
    });

    const total = await Review.countDocuments({ movie: movieId, status: 'approved' });

    res.json({
      success: true,
      data: {
        reviews,
        movieId,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get movie reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews by a specific user
// @access  Public
router.get('/user/:userId', validateObjectId('userId'), validatePagination, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const reviews = await Review.getUserReviews(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder: sortOrder === 'asc' ? 1 : -1
    });

    const total = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        reviews,
        userId,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'username firstName lastName avatar')
      .populate('movie', 'title posterPath releaseDate');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', authenticateToken, validateReviewCreation, async (req, res) => {
  try {
    const { movieId, title, content, rating } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: req.user._id,
      movie: movieId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this movie'
      });
    }

    // Create review
    const review = new Review({
      user: req.user._id,
      movie: movieId,
      title,
      content,
      rating
    });

    await review.save();

    // Add review to movie's reviews array
    movie.reviews.push(review._id);
    await movie.save();

    // Add review to user's reviews array
    req.user.reviews.push(review._id);
    await req.user.save();

    // Populate the review for response
    await review.populate('user', 'username firstName lastName avatar');
    await review.populate('movie', 'title posterPath releaseDate');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private (Owner or Admin)
router.put('/:id', authenticateToken, validateObjectId('id'), validateReviewUpdate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin
    if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Store original content for edit history
    if (req.body.title || req.body.content || req.body.rating) {
      review.editHistory.push({
        title: review.title,
        content: review.content,
        rating: review.rating
      });
    }

    // Update fields
    const allowedUpdates = ['title', 'content', 'rating'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        review[field] = req.body[field];
      }
    });

    review.lastEditedAt = new Date();
    await review.save();

    await review.populate('user', 'username firstName lastName avatar');
    await review.populate('movie', 'title posterPath releaseDate');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private (Owner or Admin)
router.delete('/:id', authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin
    if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Remove review from movie's reviews array
    await Movie.findByIdAndUpdate(review.movie, {
      $pull: { reviews: review._id }
    });

    // Remove review from user's reviews array
    await User.findByIdAndUpdate(review.user, {
      $pull: { reviews: review._id }
    });

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/reviews/:id/like
// @desc    Like a review
// @access  Private
router.post('/:id/like', authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.likeReview(req.user._id);

    res.json({
      success: true,
      message: 'Review liked successfully',
      data: {
        likeCount: review.likeCount,
        dislikeCount: review.dislikeCount
      }
    });
  } catch (error) {
    console.error('Like review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/reviews/:id/dislike
// @desc    Dislike a review
// @access  Private
router.post('/:id/dislike', authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.dislikeReview(req.user._id);

    res.json({
      success: true,
      message: 'Review disliked successfully',
      data: {
        likeCount: review.likeCount,
        dislikeCount: review.dislikeCount
      }
    });
  } catch (error) {
    console.error('Dislike review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

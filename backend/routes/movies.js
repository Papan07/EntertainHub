import express from 'express';
import { Movie, Review } from '../models/index.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { 
  validateMovieCreation, 
  validateMovieUpdate, 
  validateObjectId, 
  validateMovieQuery,
  validateSearchQuery 
} from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/movies/debug
// @desc    Debug endpoint to check database status
// @access  Public
router.get('/debug', async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const sampleMovies = await Movie.find().limit(3).lean();

    res.json({
      success: true,
      data: {
        totalMovies,
        sampleMovies,
        databaseName: Movie.db.name
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error',
      error: error.message
    });
  }
});

// @route   GET /api/movies
// @desc    Get all movies with filtering and pagination
// @access  Public
router.get('/', validateMovieQuery, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre,
      year,
      rating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      trending
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (genre) {
      filter['genres.name'] = { $regex: genre, $options: 'i' };
    }
    
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      filter.releaseDate = { $gte: startDate, $lte: endDate };
    }
    
    if (rating) {
      filter.voteAverage = { $gte: parseFloat(rating) };
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    if (trending !== undefined) {
      filter.trending = trending === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const movies = await Movie.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reviews', 'rating')
      .lean();

    // Get total count for pagination
    const total = await Movie.countDocuments(filter);

    res.json({
      success: true,
      data: {
        movies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalMovies: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/movies/search
// @desc    Search movies
// @access  Public
router.get('/search', validateSearchQuery, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    let movies = [];
    let total = 0;

    try {
      // Try text search first
      movies = await Movie.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      total = await Movie.countDocuments({ $text: { $search: q } });
    } catch (textSearchError) {
      console.log('Text search failed, falling back to regex search:', textSearchError.message);

      // Fallback to regex search if text search fails
      const searchRegex = new RegExp(q, 'i');
      const searchFilter = {
        $or: [
          { title: searchRegex },
          { originalTitle: searchRegex },
          { overview: searchRegex },
          { tagline: searchRegex },
          { 'genres.name': searchRegex }
        ]
      };

      movies = await Movie.find(searchFilter)
        .sort({ popularity: -1, voteAverage: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      total = await Movie.countDocuments(searchFilter);
    }

    res.json({
      success: true,
      data: {
        movies,
        query: q,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalMovies: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/movies/trending
// @desc    Get trending movies
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const movies = await Movie.findTrending(parseInt(limit));

    res.json({
      success: true,
      data: {
        movies
      }
    });
  } catch (error) {
    console.error('Get trending movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/movies/featured
// @desc    Get featured movies
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const movies = await Movie.findFeatured(parseInt(limit));

    res.json({
      success: true,
      data: {
        movies
      }
    });
  } catch (error) {
    console.error('Get featured movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie by ID
// @access  Public
router.get('/:id', validateObjectId('id'), optionalAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'username firstName lastName avatar'
        },
        match: { status: 'approved' },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Increment view count
    await movie.incrementViewCount();

    // Check if user has favorited or added to watchlist (if authenticated)
    let userInteractions = {};
    if (req.user) {
      userInteractions = {
        isFavorited: req.user.favorites.includes(movie._id),
        isInWatchlist: req.user.watchlist.includes(movie._id)
      };
    }

    res.json({
      success: true,
      data: {
        movie,
        userInteractions
      }
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/movies
// @desc    Create new movie (Admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, validateMovieCreation, async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      addedBy: req.user._id
    };

    const movie = new Movie(movieData);
    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: {
        movie
      }
    });
  } catch (error) {
    console.error('Create movie error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Movie with this TMDB ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update movie (Admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, validateObjectId('id'), validateMovieUpdate, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: {
        movie
      }
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Also delete associated reviews
    await Review.deleteMany({ movie: req.params.id });

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

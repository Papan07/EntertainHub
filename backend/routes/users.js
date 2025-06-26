import express from 'express';
import { User, Movie, Watchlist } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateObjectId, validatePagination, validateWatchlistCreation } from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/users/favorites
// @desc    Get user's favorite movies
// @access  Private
router.get('/favorites', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        options: {
          sort: { createdAt: -1 },
          limit: limit * 1,
          skip: (page - 1) * limit
        }
      });

    const totalFavorites = user.favorites.length;

    res.json({
      success: true,
      data: {
        favorites: user.favorites,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalFavorites / limit),
          totalFavorites,
          hasNextPage: page < Math.ceil(totalFavorites / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/favorites/:movieId
// @desc    Add movie to favorites
// @access  Private
router.post('/favorites/:movieId', authenticateToken, validateObjectId('movieId'), async (req, res) => {
  try {
    const { movieId } = req.params;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if already in favorites
    if (req.user.favorites.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in favorites'
      });
    }

    // Add to favorites
    req.user.favorites.push(movieId);
    await req.user.save();

    // Increment movie's favorite count
    movie.favoriteCount += 1;
    await movie.save();

    res.json({
      success: true,
      message: 'Movie added to favorites',
      data: {
        favoriteCount: req.user.favorites.length
      }
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/users/favorites/:movieId
// @desc    Remove movie from favorites
// @access  Private
router.delete('/favorites/:movieId', authenticateToken, validateObjectId('movieId'), async (req, res) => {
  try {
    const { movieId } = req.params;

    // Check if in favorites
    if (!req.user.favorites.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie not in favorites'
      });
    }

    // Remove from favorites
    req.user.favorites = req.user.favorites.filter(id => !id.equals(movieId));
    await req.user.save();

    // Decrement movie's favorite count
    const movie = await Movie.findById(movieId);
    if (movie && movie.favoriteCount > 0) {
      movie.favoriteCount -= 1;
      await movie.save();
    }

    res.json({
      success: true,
      message: 'Movie removed from favorites',
      data: {
        favoriteCount: req.user.favorites.length
      }
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/watchlist
// @desc    Get user's watchlist movies
// @access  Private
router.get('/watchlist', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'watchlist',
        options: {
          sort: { createdAt: -1 },
          limit: limit * 1,
          skip: (page - 1) * limit
        }
      });

    const totalWatchlist = user.watchlist.length;

    res.json({
      success: true,
      data: {
        watchlist: user.watchlist,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalWatchlist / limit),
          totalWatchlist,
          hasNextPage: page < Math.ceil(totalWatchlist / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/watchlist/:movieId
// @desc    Add movie to watchlist
// @access  Private
router.post('/watchlist/:movieId', authenticateToken, validateObjectId('movieId'), async (req, res) => {
  try {
    const { movieId } = req.params;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if already in watchlist
    if (req.user.watchlist.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist'
      });
    }

    // Add to watchlist
    req.user.watchlist.push(movieId);
    await req.user.save();

    // Increment movie's watchlist count
    movie.watchlistCount += 1;
    await movie.save();

    res.json({
      success: true,
      message: 'Movie added to watchlist',
      data: {
        watchlistCount: req.user.watchlist.length
      }
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/users/watchlist/:movieId
// @desc    Remove movie from watchlist
// @access  Private
router.delete('/watchlist/:movieId', authenticateToken, validateObjectId('movieId'), async (req, res) => {
  try {
    const { movieId } = req.params;

    // Check if in watchlist
    if (!req.user.watchlist.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie not in watchlist'
      });
    }

    // Remove from watchlist
    req.user.watchlist = req.user.watchlist.filter(id => !id.equals(movieId));
    await req.user.save();

    // Decrement movie's watchlist count
    const movie = await Movie.findById(movieId);
    if (movie && movie.watchlistCount > 0) {
      movie.watchlistCount -= 1;
      await movie.save();
    }

    res.json({
      success: true,
      message: 'Movie removed from watchlist',
      data: {
        watchlistCount: req.user.watchlist.length
      }
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/watchlists
// @desc    Get user's custom watchlists
// @access  Private
router.get('/watchlists', authenticateToken, async (req, res) => {
  try {
    const watchlists = await Watchlist.getUserWatchlists(req.user._id);

    res.json({
      success: true,
      data: {
        watchlists
      }
    });
  } catch (error) {
    console.error('Get watchlists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/watchlists
// @desc    Create new custom watchlist
// @access  Private
router.post('/watchlists', authenticateToken, validateWatchlistCreation, async (req, res) => {
  try {
    const { name, description, isPublic, tags } = req.body;

    const watchlist = new Watchlist({
      user: req.user._id,
      name,
      description,
      isPublic: isPublic || false,
      tags: tags || []
    });

    await watchlist.save();

    res.status(201).json({
      success: true,
      message: 'Watchlist created successfully',
      data: {
        watchlist
      }
    });
  } catch (error) {
    console.error('Create watchlist error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Watchlist with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/watchlists/:id
// @desc    Get specific watchlist
// @access  Private
router.get('/watchlists/:id', authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const watchlist = await Watchlist.findById(req.params.id)
      .populate('movies.movie', 'title posterPath releaseDate runtime voteAverage');

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist not found'
      });
    }

    // Check if user owns the watchlist or it's public
    if (!watchlist.user.equals(req.user._id) && !watchlist.isPublic) {
      // Check if shared with user
      const isShared = watchlist.sharedWith.some(share => 
        share.user.equals(req.user._id)
      );
      
      if (!isShared && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: {
        watchlist
      }
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/watchlists/:id/movies/:movieId
// @desc    Add movie to custom watchlist
// @access  Private
router.post('/watchlists/:id/movies/:movieId', 
  authenticateToken, 
  validateObjectId('id'), 
  validateObjectId('movieId'), 
  async (req, res) => {
    try {
      const { id: watchlistId, movieId } = req.params;
      const { priority, notes } = req.body;

      const watchlist = await Watchlist.findById(watchlistId);
      
      if (!watchlist) {
        return res.status(404).json({
          success: false,
          message: 'Watchlist not found'
        });
      }

      // Check ownership
      if (!watchlist.user.equals(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Check if movie exists
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      await watchlist.addMovie(movieId, { priority, notes });

      res.json({
        success: true,
        message: 'Movie added to watchlist',
        data: {
          watchlist
        }
      });
    } catch (error) {
      if (error.message === 'Movie already exists in watchlist') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      console.error('Add movie to watchlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   GET /api/users/profile/:userId
// @desc    Get public user profile
// @access  Public
router.get('/profile/:userId', validateObjectId('userId'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -email')
      .populate('favorites', 'title posterPath releaseDate voteAverage')
      .populate({
        path: 'reviews',
        populate: {
          path: 'movie',
          select: 'title posterPath releaseDate'
        },
        options: { sort: { createdAt: -1 }, limit: 5 }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get public watchlists
    const publicWatchlists = await Watchlist.find({
      user: req.params.userId,
      isPublic: true
    }).populate('movies.movie', 'title posterPath');

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile(),
        publicWatchlists,
        stats: {
          totalReviews: user.reviews.length,
          totalFavorites: user.favorites.length,
          totalWatchlists: publicWatchlists.length
        }
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

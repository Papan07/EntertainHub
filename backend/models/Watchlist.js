import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  // User who owns the watchlist
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required for watchlist']
  },
  
  // Watchlist details
  name: {
    type: String,
    required: [true, 'Watchlist name is required'],
    trim: true,
    maxlength: [100, 'Watchlist name cannot exceed 100 characters'],
    default: 'My Watchlist'
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Privacy settings
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Movies in the watchlist
  movies: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    notes: {
      type: String,
      maxlength: [200, 'Notes cannot exceed 200 characters']
    },
    watched: {
      type: Boolean,
      default: false
    },
    watchedAt: {
      type: Date
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    }
  }],
  
  // Watchlist categories/tags
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  // Sharing and collaboration
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistics
  totalMovies: {
    type: Number,
    default: 0
  },
  watchedMovies: {
    type: Number,
    default: 0
  },
  totalRuntime: {
    type: Number,
    default: 0 // in minutes
  },
  
  // Sorting preferences
  sortBy: {
    type: String,
    enum: ['addedAt', 'releaseDate', 'rating', 'priority', 'title'],
    default: 'addedAt'
  },
  sortOrder: {
    type: String,
    enum: ['asc', 'desc'],
    default: 'desc'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for user watchlists
watchlistSchema.index({ user: 1, createdAt: -1 });
watchlistSchema.index({ user: 1, name: 1 }, { unique: true });

// Index for public watchlists
watchlistSchema.index({ isPublic: 1, createdAt: -1 });

// Index for movie lookups
watchlistSchema.index({ 'movies.movie': 1 });

// Virtual for completion percentage
watchlistSchema.virtual('completionPercentage').get(function() {
  if (this.totalMovies === 0) return 0;
  return Math.round((this.watchedMovies / this.totalMovies) * 100);
});

// Virtual for unwatched movies count
watchlistSchema.virtual('unwatchedMovies').get(function() {
  return this.totalMovies - this.watchedMovies;
});

// Virtual for average rating of watched movies
watchlistSchema.virtual('averageRating').get(function() {
  const ratedMovies = this.movies.filter(item => item.watched && item.rating);
  if (ratedMovies.length === 0) return 0;
  
  const totalRating = ratedMovies.reduce((sum, item) => sum + item.rating, 0);
  return Math.round((totalRating / ratedMovies.length) * 10) / 10;
});

// Pre-save middleware to update statistics
watchlistSchema.pre('save', function(next) {
  this.totalMovies = this.movies.length;
  this.watchedMovies = this.movies.filter(item => item.watched).length;
  
  // Calculate total runtime (would need movie data populated)
  // This is a placeholder - in practice, you'd populate movie data to get runtime
  this.totalRuntime = this.movies.length * 120; // Assuming 2 hours per movie
  
  next();
});

// Instance method to add movie to watchlist
watchlistSchema.methods.addMovie = function(movieId, options = {}) {
  // Check if movie already exists in watchlist
  const existingMovie = this.movies.find(item => 
    item.movie.toString() === movieId.toString()
  );
  
  if (existingMovie) {
    throw new Error('Movie already exists in watchlist');
  }
  
  this.movies.push({
    movie: movieId,
    priority: options.priority || 'medium',
    notes: options.notes || ''
  });
  
  return this.save();
};

// Instance method to remove movie from watchlist
watchlistSchema.methods.removeMovie = function(movieId) {
  this.movies = this.movies.filter(item => 
    item.movie.toString() !== movieId.toString()
  );
  
  return this.save();
};

// Instance method to mark movie as watched
watchlistSchema.methods.markAsWatched = function(movieId, rating = null) {
  const movieItem = this.movies.find(item => 
    item.movie.toString() === movieId.toString()
  );
  
  if (!movieItem) {
    throw new Error('Movie not found in watchlist');
  }
  
  movieItem.watched = true;
  movieItem.watchedAt = new Date();
  if (rating) {
    movieItem.rating = rating;
  }
  
  return this.save();
};

// Instance method to mark movie as unwatched
watchlistSchema.methods.markAsUnwatched = function(movieId) {
  const movieItem = this.movies.find(item => 
    item.movie.toString() === movieId.toString()
  );
  
  if (!movieItem) {
    throw new Error('Movie not found in watchlist');
  }
  
  movieItem.watched = false;
  movieItem.watchedAt = null;
  movieItem.rating = null;
  
  return this.save();
};

// Instance method to update movie priority
watchlistSchema.methods.updateMoviePriority = function(movieId, priority) {
  const movieItem = this.movies.find(item => 
    item.movie.toString() === movieId.toString()
  );
  
  if (!movieItem) {
    throw new Error('Movie not found in watchlist');
  }
  
  movieItem.priority = priority;
  return this.save();
};

// Instance method to share watchlist
watchlistSchema.methods.shareWith = function(userId, permission = 'view') {
  // Check if already shared with this user
  const existingShare = this.sharedWith.find(share => 
    share.user.toString() === userId.toString()
  );
  
  if (existingShare) {
    existingShare.permission = permission;
  } else {
    this.sharedWith.push({
      user: userId,
      permission
    });
  }
  
  return this.save();
};

// Static method to get user's watchlists
watchlistSchema.statics.getUserWatchlists = function(userId) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('movies.movie', 'title posterPath releaseDate runtime');
};

// Static method to get public watchlists
watchlistSchema.statics.getPublicWatchlists = function(options = {}) {
  const { page = 1, limit = 10 } = options;
  
  return this.find({ isPublic: true })
    .populate('user', 'username firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;

import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  // TMDB specific fields
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness for non-null values
  },
  imdbId: {
    type: String,
    sparse: true
  },
  
  // Basic movie information
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  originalTitle: {
    type: String,
    trim: true
  },
  overview: {
    type: String,
    required: [true, 'Movie overview is required'],
    maxlength: [2000, 'Overview cannot exceed 2000 characters']
  },
  tagline: {
    type: String,
    maxlength: [300, 'Tagline cannot exceed 300 characters']
  },
  
  // Release information
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  status: {
    type: String,
    enum: ['Rumored', 'Planned', 'In Production', 'Post Production', 'Released', 'Canceled'],
    default: 'Released'
  },
  
  // Media and visuals
  posterPath: {
    type: String,
    default: null
  },
  backdropPath: {
    type: String,
    default: null
  },
  trailerUrl: {
    type: String,
    default: null
  },
  
  // Ratings and popularity
  voteAverage: {
    type: Number,
    min: [0, 'Vote average cannot be negative'],
    max: [10, 'Vote average cannot exceed 10'],
    default: 0
  },
  voteCount: {
    type: Number,
    min: [0, 'Vote count cannot be negative'],
    default: 0
  },
  popularity: {
    type: Number,
    min: [0, 'Popularity cannot be negative'],
    default: 0
  },
  
  // Technical details
  runtime: {
    type: Number,
    min: [0, 'Runtime cannot be negative']
  },
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative'],
    default: 0
  },
  revenue: {
    type: Number,
    min: [0, 'Revenue cannot be negative'],
    default: 0
  },
  
  // Classification
  genres: [{
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    }
  }],
  
  // Language and region
  originalLanguage: {
    type: String,
    default: 'en'
  },
  spokenLanguages: [{
    iso_639_1: String,
    name: String
  }],
  productionCountries: [{
    iso_3166_1: String,
    name: String
  }],
  
  // Production details
  productionCompanies: [{
    id: Number,
    name: String,
    logoPath: String,
    originCountry: String
  }],
  
  // Content rating
  adult: {
    type: Boolean,
    default: false
  },
  
  // Custom fields for our application
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  
  // User engagement
  viewCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },
  watchlistCount: {
    type: Number,
    default: 0
  },
  
  // Admin fields
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Reviews reference
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
movieSchema.index({ tmdbId: 1 });
movieSchema.index({ title: 'text', overview: 'text' });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ voteAverage: -1 });
movieSchema.index({ popularity: -1 });
movieSchema.index({ 'genres.name': 1 });
movieSchema.index({ featured: 1 });
movieSchema.index({ trending: 1 });
movieSchema.index({ createdAt: -1 });

// Virtual for average rating from reviews
movieSchema.virtual('averageRating').get(function() {
  if (this.reviews && this.reviews.length > 0) {
    // This would need to be populated with actual review data
    return this.voteAverage;
  }
  return this.voteAverage;
});

// Virtual for formatted release year
movieSchema.virtual('releaseYear').get(function() {
  return this.releaseDate ? this.releaseDate.getFullYear() : null;
});

// Virtual for poster URL
movieSchema.virtual('posterUrl').get(function() {
  return this.posterPath ? `https://image.tmdb.org/t/p/w500${this.posterPath}` : null;
});

// Virtual for backdrop URL
movieSchema.virtual('backdropUrl').get(function() {
  return this.backdropPath ? `https://image.tmdb.org/t/p/w1280${this.backdropPath}` : null;
});

// Static method to find movies by genre
movieSchema.statics.findByGenre = function(genreName) {
  return this.find({ 'genres.name': { $regex: genreName, $options: 'i' } });
};

// Static method to find trending movies
movieSchema.statics.findTrending = function(limit = 20) {
  return this.find({ trending: true })
    .sort({ popularity: -1 })
    .limit(limit);
};

// Static method to find featured movies
movieSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance method to increment view count
movieSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;

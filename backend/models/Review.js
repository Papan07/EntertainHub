import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // User who wrote the review
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required for review']
  },
  
  // Movie being reviewed
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie is required for review']
  },
  
  // Review content
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Review title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    minlength: [10, 'Review content must be at least 10 characters long'],
    maxlength: [2000, 'Review content cannot exceed 2000 characters']
  },
  
  // Rating (1-10 scale)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating cannot exceed 10']
  },
  
  // Review status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  
  // Engagement metrics
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  dislikes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Moderation
  reported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  },
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'offensive', 'fake', 'other'],
      required: true
    },
    description: {
      type: String,
      maxlength: [500, 'Report description cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Admin fields
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationNote: {
    type: String,
    maxlength: [500, 'Moderation note cannot exceed 500 characters']
  },
  
  // Timestamps for editing
  lastEditedAt: {
    type: Date
  },
  editHistory: [{
    content: String,
    title: String,
    rating: Number,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure one review per user per movie
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

// Other indexes for performance
reviewSchema.index({ movie: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ reported: 1 });

// Virtual for like count
reviewSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for dislike count
reviewSchema.virtual('dislikeCount').get(function() {
  return this.dislikes ? this.dislikes.length : 0;
});

// Virtual for net score (likes - dislikes)
reviewSchema.virtual('netScore').get(function() {
  return this.likeCount - this.dislikeCount;
});

// Virtual to check if review was edited
reviewSchema.virtual('isEdited').get(function() {
  return this.lastEditedAt && this.lastEditedAt > this.createdAt;
});

// Instance method to like a review
reviewSchema.methods.likeReview = function(userId) {
  // Remove from dislikes if present
  this.dislikes = this.dislikes.filter(dislike => 
    !dislike.user.equals(userId)
  );
  
  // Add to likes if not already present
  const alreadyLiked = this.likes.some(like => 
    like.user.equals(userId)
  );
  
  if (!alreadyLiked) {
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

// Instance method to dislike a review
reviewSchema.methods.dislikeReview = function(userId) {
  // Remove from likes if present
  this.likes = this.likes.filter(like => 
    !like.user.equals(userId)
  );
  
  // Add to dislikes if not already present
  const alreadyDisliked = this.dislikes.some(dislike => 
    dislike.user.equals(userId)
  );
  
  if (!alreadyDisliked) {
    this.dislikes.push({ user: userId });
  }
  
  return this.save();
};

// Instance method to remove like/dislike
reviewSchema.methods.removeLikeDislike = function(userId) {
  this.likes = this.likes.filter(like => 
    !like.user.equals(userId)
  );
  this.dislikes = this.dislikes.filter(dislike => 
    !dislike.user.equals(userId)
  );
  
  return this.save();
};

// Instance method to report review
reviewSchema.methods.reportReview = function(userId, reason, description) {
  // Check if user already reported this review
  const alreadyReported = this.reports.some(report => 
    report.user.equals(userId)
  );
  
  if (!alreadyReported) {
    this.reports.push({
      user: userId,
      reason,
      description
    });
    this.reportCount += 1;
    
    // Auto-flag if too many reports
    if (this.reportCount >= 5) {
      this.reported = true;
    }
  }
  
  return this.save();
};

// Static method to get reviews for a movie
reviewSchema.statics.getMovieReviews = function(movieId, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = -1,
    status = 'approved'
  } = options;
  
  return this.find({ movie: movieId, status })
    .populate('user', 'username firstName lastName avatar')
    .sort({ [sortBy]: sortOrder })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get user reviews
reviewSchema.statics.getUserReviews = function(userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;
  
  return this.find({ user: userId })
    .populate('movie', 'title posterPath releaseDate')
    .sort({ [sortBy]: sortOrder })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbApi';
import { localStorageService } from '../services/localStorage';
import './MovieCard.css';

const MovieCard = ({ movie, size = 'medium' }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);



  // Handle both TMDB IDs and MongoDB ObjectIds
  const movieId = movie.id || movie._id || movie.tmdbId;
  const [isFavorite, setIsFavorite] = useState(localStorageService.favorites.isFavorite(movieId));
  const [isInWatchlist, setIsInWatchlist] = useState(localStorageService.watchlist.isInWatchlist(movieId));

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      localStorageService.favorites.remove(movieId);
      setIsFavorite(false);
    } else {
      localStorageService.favorites.add({ ...movie, id: movieId });
      setIsFavorite(true);
    }
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (isInWatchlist) {
      localStorageService.watchlist.remove(movieId);
      setIsInWatchlist(false);
    } else {
      localStorageService.watchlist.add({ ...movie, id: movieId });
      setIsInWatchlist(true);
    }
  };

  const handleCardClick = () => {
    // Determine if this is a local movie or TMDB movie
    const isLocalMovie = movie._id || (movie.tmdbId && !movie.id);

    if (isLocalMovie) {
      // Navigate to local movie detail page
      navigate(`/movie/local/${movie._id || movieId}`);
    } else {
      // Navigate to TMDB movie detail page
      navigate(`/movie/tmdb/${movieId}`);
    }
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  // Safety check for movie data
  if (!movie) {
    console.error('MovieCard: No movie data provided');
    return null;
  }

  return (
    <div className={`movie-card ${size}`} onClick={handleCardClick}>
      <div className="movie-poster-container">
        {!imageLoaded && !imageError && (
          <div className="poster-skeleton">
            <div className="skeleton-shimmer"></div>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '12px',
              textAlign: 'center'
            }}>
              Loading...
            </div>
          </div>
        )}

        {imageError ? (
          <div className="poster-placeholder">
            <div className="placeholder-icon">🎬</div>
            <span>Image Error</span>
            <div style={{ fontSize: '10px', marginTop: '5px' }}>
              {movie.title}
            </div>
          </div>
        ) : (
          <img
            src={(() => {
              const imageUrl = getImageUrl(movie.poster_path || movie.posterPath, size === 'large' ? 'w780' : 'w500');
              console.log('Generated image URL:', imageUrl, 'for movie:', movie.title);
              return imageUrl;
            })()}
            alt={movie.title || 'Movie Poster'}
            className={`movie-poster ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}

        {/* Overlay with actions */}
        <div className="movie-overlay">
          <div className="movie-actions">
            <button
              className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            
            <button
              className={`action-btn watchlist-btn ${isInWatchlist ? 'active' : ''}`}
              onClick={handleWatchlistClick}
              title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <svg viewBox="0 0 24 24" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          {/* Rating badge */}
          {(movie.vote_average || movie.voteAverage) && (
            <div className="rating-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span>{formatRating(movie.vote_average || movie.voteAverage)}</span>
            </div>
          )}
        </div>
      </div>



      {/* Hover effect overlay */}
      <div className="hover-overlay">
        <div className="play-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"></polygon>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

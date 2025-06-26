import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../services/tmdbApi';
import { moviesAPI } from '../services/api';
import { localStorageService } from '../services/localStorage';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id, source } = useParams(); // source can be 'tmdb' or 'local'
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (id) {
      loadMovieDetails();
    }
  }, [id, source]);

  useEffect(() => {
    if (movie) {
      setIsFavorite(localStorageService.favorites.isFavorite(movie.id));
      setIsInWatchlist(localStorageService.watchlist.isInWatchlist(movie.id));
    }
  }, [movie]);

  const loadMovieDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      let movieData;
      
      if (source === 'local') {
        // Load from local database
        const response = await moviesAPI.getMovie(id);
        movieData = response.data.movie;
      } else {
        // Load from TMDB (default)
        movieData = await tmdbApi.getMovieDetails(id);
      }

      setMovie(movieData);
    } catch (err) {
      console.error('Error loading movie details:', err);
      setError('Failed to load movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (!movie) return;

    if (isFavorite) {
      localStorageService.favorites.remove(movie.id);
      setIsFavorite(false);
    } else {
      localStorageService.favorites.add(movie);
      setIsFavorite(true);
    }
  };

  const handleWatchlistToggle = () => {
    if (!movie) return;

    if (isInWatchlist) {
      localStorageService.watchlist.remove(movie.id);
      setIsInWatchlist(false);
    } else {
      localStorageService.watchlist.add(movie);
      setIsInWatchlist(true);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const formatYear = (dateString) => {
    return dateString ? new Date(dateString).getFullYear() : 'TBA';
  };

  const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  if (loading) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading movie details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-container">
          <div className="error-container">
            <h2>Error Loading Movie</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={loadMovieDetails} className="retry-btn">
                Try Again
              </button>
              <button onClick={handleBackClick} className="back-btn">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-container">
          <div className="not-found-container">
            <h2>Movie Not Found</h2>
            <p>The movie you're looking for doesn't exist.</p>
            <button onClick={handleBackClick} className="back-btn">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div 
          className="movie-backdrop"
          style={{
            backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'w1280')})`
          }}
        >
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="movie-detail-container">
        {/* Back Button */}
        <button onClick={handleBackClick} className="back-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        {/* Movie Content */}
        <div className="movie-content">
          {/* Poster */}
          <div className="movie-poster-section">
            {movie.poster_path ? (
              <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="movie-poster-large"
              />
            ) : (
              <div className="poster-placeholder-large">
                <div className="placeholder-icon">🎬</div>
                <span>No Image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="movie-info-section">
            <div className="movie-header">
              <h1 className="movie-title">{movie.title}</h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="original-title">({movie.original_title})</p>
              )}
              
              {movie.tagline && (
                <p className="movie-tagline">"{movie.tagline}"</p>
              )}
            </div>

            {/* Meta Information */}
            <div className="movie-meta">
              <div className="meta-item">
                <span className="meta-label">Year:</span>
                <span className="meta-value">{formatYear(movie.release_date)}</span>
              </div>
              
              {movie.runtime && (
                <div className="meta-item">
                  <span className="meta-label">Runtime:</span>
                  <span className="meta-value">{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              
              {movie.vote_average && (
                <div className="meta-item">
                  <span className="meta-label">Rating:</span>
                  <span className="meta-value">
                    ⭐ {formatRating(movie.vote_average)} / 10
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="movie-genres">
                {movie.genres.map((genre) => (
                  <span key={genre.id || genre.name} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <div className="movie-overview">
                <h3>Overview</h3>
                <p>{movie.overview}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="movie-actions">
              <button
                onClick={handleFavoriteToggle}
                className={`action-button favorite-button ${isFavorite ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>

              <button
                onClick={handleWatchlistToggle}
                className={`action-button watchlist-button ${isInWatchlist ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            </div>

            {/* Additional Info */}
            {(movie.production_companies || movie.production_countries) && (
              <div className="additional-info">
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="info-section">
                    <h4>Production Companies</h4>
                    <p>{movie.production_companies.map(company => company.name).join(', ')}</p>
                  </div>
                )}

                {movie.production_countries && movie.production_countries.length > 0 && (
                  <div className="info-section">
                    <h4>Countries</h4>
                    <p>{movie.production_countries.map(country => country.name).join(', ')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

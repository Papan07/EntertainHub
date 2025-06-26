import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../services/tmdbApi';
import { localStorageService } from '../services/localStorage';
import './HeroSection.css';

const HeroSection = ({ featuredMovies = [], loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentMovie = featuredMovies[currentIndex];

  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000); // Change slide every 8 seconds

      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleWatchTrailer = () => {
    console.log('Watch trailer for:', currentMovie?.title);
    // Implement trailer functionality
  };

  const handleAddToWatchlist = () => {
    if (currentMovie) {
      localStorageService.watchlist.add(currentMovie);
      // You can add a toast notification here
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const formatYear = (dateString) => {
    return dateString ? new Date(dateString).getFullYear() : '';
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="hero-section">
        <div className="hero-skeleton">
          <div className="hero-skeleton-bg">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="hero-content">
            <div className="hero-skeleton-content">
              <div className="skeleton-badge"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-description"></div>
              <div className="skeleton-buttons"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="hero-section">
        <div className="hero-empty">
          <div className="empty-icon">🎬</div>
          <h2>No featured movies available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-section">
      {/* Background Image */}
      <div className="hero-background">
        <img
          src={getImageUrl(currentMovie.backdrop_path, 'w1280')}
          alt={currentMovie.title}
          className={`hero-bg-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-info">
          <div className="hero-badge">
            <span>✨ Featured Movie</span>
          </div>
          
          <h1 className="hero-title">{currentMovie.title}</h1>
          
          <div className="hero-meta">
            <span className="hero-year">{formatYear(currentMovie.release_date)}</span>
            <span className="hero-rating">
              ⭐ {formatRating(currentMovie.vote_average)}
            </span>
            <span className="hero-genre">Action • Adventure</span>
          </div>

          <p className="hero-description">
            {truncateText(currentMovie.overview, 200)}
          </p>

          <div className="hero-actions">
            <button className="hero-btn primary" onClick={handleWatchTrailer}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
              Watch Trailer
            </button>
            
            <button className="hero-btn secondary" onClick={handleAddToWatchlist}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              Add to Watchlist
            </button>
          </div>
        </div>

        {/* Movie Poster */}
        <div className="hero-poster">
          <img
            src={getImageUrl(currentMovie.poster_path, 'w500')}
            alt={currentMovie.title}
            className="poster-image"
          />
        </div>
      </div>

      {/* Slide Indicators */}
      {featuredMovies.length > 1 && (
        <div className="hero-indicators">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <button 
            className="hero-nav prev"
            onClick={() => goToSlide(currentIndex === 0 ? featuredMovies.length - 1 : currentIndex - 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <button 
            className="hero-nav next"
            onClick={() => goToSlide(currentIndex === featuredMovies.length - 1 ? 0 : currentIndex + 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default HeroSection;

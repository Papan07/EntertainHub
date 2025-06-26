import React, { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import './MovieCarousel.css';

const MovieCarousel = ({ 
  title, 
  movies = [], 
  loading = false, 
  error = null,
  cardSize = 'medium',
  showViewAll = true,
  onViewAll = null
}) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    checkScrollButtons();
  }, [movies]);

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = cardSize === 'large' ? 300 : cardSize === 'medium' ? 240 : 200;
      const newScrollLeft = direction === 'left' 
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log(`View all ${title}`);
      // Implement navigation to category page
    }
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className={`skeleton-card ${cardSize}`}>
      <div className="skeleton-poster">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-details">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="carousel-section">
        <div className="carousel-header">
          <h2 className="carousel-title">{title}</h2>
        </div>
        <div className="carousel-error">
          <div className="error-icon">⚠️</div>
          <p>Failed to load {title.toLowerCase()}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        {showViewAll && !loading && movies.length > 0 && (
          <button className="view-all-btn" onClick={handleViewAll}>
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        )}
      </div>

      <div className="carousel-container">
        {/* Left scroll button */}
        {!loading && movies.length > 0 && (
          <button 
            className={`scroll-btn scroll-left ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}

        {/* Carousel content */}
        <div 
          className="carousel-content"
          ref={carouselRef}
          onScroll={checkScrollButtons}
        >
          {loading ? (
            // Show skeleton cards while loading
            Array.from({ length: 8 }, (_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))
          ) : movies.length > 0 ? (
            // Show actual movie cards
            movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                size={cardSize}
                showDetails={true}
              />
            ))
          ) : (
            // Show empty state
            <div className="carousel-empty">
              <div className="empty-icon">🎬</div>
              <p>No movies available</p>
            </div>
          )}
        </div>

        {/* Right scroll button */}
        {!loading && movies.length > 0 && (
          <button 
            className={`scroll-btn scroll-right ${!canScrollRight ? 'disabled' : ''}`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCarousel;

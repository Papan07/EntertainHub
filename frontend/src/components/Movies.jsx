import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import MovieCard from './MovieCard';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('popular');

  const categories = [
    { key: 'popular', label: 'Popular Movies' },
    { key: 'top_rated', label: 'Top Rated' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'now_playing', label: 'Now Playing' }
  ];

  useEffect(() => {
    fetchMovies();
  }, [category, currentPage]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (category) {
        case 'popular':
          response = await tmdbApi.getPopularMovies(currentPage);
          break;
        case 'top_rated':
          response = await tmdbApi.getTopRatedMovies(currentPage);
          break;
        case 'upcoming':
          response = await tmdbApi.getUpcomingMovies(currentPage);
          break;
        case 'now_playing':
          response = await tmdbApi.getNowPlayingMovies(currentPage);
          break;
        default:
          response = await tmdbApi.getPopularMovies(currentPage);
      }

      setMovies(response.results || []);
      setTotalPages(Math.min(response.total_pages || 1, 500)); // TMDB limits to 500 pages
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ←
        </button>
      );
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          →
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="movies-page">
        <div className="movies-loading">
          <div className="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies-page">
        <div className="movies-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchMovies}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="movies-header">
        <h1>Movies</h1>
        <p>Discover amazing movies from around the world</p>
      </div>

      <div className="movies-categories">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`category-btn ${category === cat.key ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="movies-pagination">
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          <div className="pagination-controls">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;

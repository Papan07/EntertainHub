import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import MovieCard from './MovieCard';
import './Series.css';

const Series = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('popular');

  const categories = [
    { key: 'popular', label: 'Popular Series' },
    { key: 'top_rated', label: 'Top Rated' },
    { key: 'on_the_air', label: 'On The Air' },
    { key: 'airing_today', label: 'Airing Today' }
  ];

  useEffect(() => {
    fetchSeries();
  }, [category, currentPage]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (category) {
        case 'popular':
          response = await tmdbApi.getPopularTVShows(currentPage);
          break;
        case 'top_rated':
          response = await tmdbApi.getTopRatedTVShows(currentPage);
          break;
        case 'on_the_air':
          response = await tmdbApi.getOnTheAirTVShows(currentPage);
          break;
        case 'airing_today':
          response = await tmdbApi.getAiringTodayTVShows(currentPage);
          break;
        default:
          response = await tmdbApi.getPopularTVShows(currentPage);
      }

      // Transform TV show data to match movie card format
      const transformedSeries = response.results?.map(show => ({
        ...show,
        title: show.name || show.original_name,
        release_date: show.first_air_date,
        media_type: 'tv'
      })) || [];

      setSeries(transformedSeries);
      setTotalPages(Math.min(response.total_pages || 1, 500));
    } catch (err) {
      console.error('Error fetching series:', err);
      setError('Failed to load series. Please try again.');
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
      <div className="series-page">
        <div className="series-loading">
          <div className="loading-spinner"></div>
          <p>Loading series...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="series-page">
        <div className="series-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchSeries}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="series-page">
      <div className="series-header">
        <h1>TV Series</h1>
        <p>Discover captivating TV shows and series from around the world</p>
      </div>

      <div className="series-categories">
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

      <div className="series-grid">
        {series.map((show) => (
          <MovieCard key={show.id} movie={show} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="series-pagination">
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

export default Series;

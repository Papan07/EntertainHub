import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import MovieCard from './MovieCard';
import './Trending.css';

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeWindow, setTimeWindow] = useState('day');

  const timeWindows = [
    { key: 'day', label: 'Today' },
    { key: 'week', label: 'This Week' }
  ];

  useEffect(() => {
    fetchTrending();
  }, [timeWindow]);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tmdbApi.getTrending(timeWindow);
      
      // Transform data to ensure consistent format
      const transformedTrending = response.results?.map(item => ({
        ...item,
        title: item.title || item.name || item.original_name,
        release_date: item.release_date || item.first_air_date,
        media_type: item.media_type || 'movie'
      })) || [];

      setTrending(transformedTrending);
    } catch (err) {
      console.error('Error fetching trending:', err);
      setError('Failed to load trending content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeWindowChange = (newTimeWindow) => {
    setTimeWindow(newTimeWindow);
  };

  if (loading) {
    return (
      <div className="trending-page">
        <div className="trending-loading">
          <div className="loading-spinner"></div>
          <p>Loading trending content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-page">
        <div className="trending-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchTrending}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-page">
      <div className="trending-header">
        <h1>Trending Now</h1>
        <p>Discover what's hot in movies and TV shows</p>
      </div>

      <div className="trending-filters">
        {timeWindows.map((window) => (
          <button
            key={window.key}
            className={`filter-btn ${timeWindow === window.key ? 'active' : ''}`}
            onClick={() => handleTimeWindowChange(window.key)}
          >
            {window.label}
          </button>
        ))}
      </div>

      <div className="trending-grid">
        {trending.map((item) => (
          <div key={`${item.media_type}-${item.id}`} className="trending-item">
            <MovieCard movie={item} />
            <div className="media-type-badge">
              {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
            </div>
          </div>
        ))}
      </div>

      {trending.length === 0 && !loading && (
        <div className="no-trending">
          <div className="no-trending-icon">📈</div>
          <h3>No trending content found</h3>
          <p>Check back later for the latest trending movies and TV shows.</p>
        </div>
      )}
    </div>
  );
};

export default Trending;

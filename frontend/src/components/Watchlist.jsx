import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { localStorageService } from '../services/localStorage';
import MovieCard from './MovieCard';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { isAuthenticated, user } = useAuth();

  const filters = [
    { key: 'all', label: 'All Items' },
    { key: 'movie', label: 'Movies' },
    { key: 'tv', label: 'TV Shows' }
  ];

  useEffect(() => {
    loadWatchlist();
  }, [isAuthenticated]);

  const loadWatchlist = () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const userWatchlist = localStorageService.watchlist.get();
        setWatchlist(userWatchlist);
      } else {
        setWatchlist([]);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = (itemId) => {
    try {
      localStorageService.watchlist.remove(itemId);
      setWatchlist(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const clearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      try {
        localStorageService.watchlist.clear();
        setWatchlist([]);
      } catch (error) {
        console.error('Error clearing watchlist:', error);
      }
    }
  };

  const filteredWatchlist = watchlist.filter(item => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

  if (!isAuthenticated) {
    return (
      <div className="watchlist-page">
        <div className="watchlist-auth-required">
          <div className="auth-icon">🔒</div>
          <h2>Sign In Required</h2>
          <p>Please sign in to view and manage your watchlist.</p>
          <a href="/login" className="sign-in-btn">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="watchlist-page">
        <div className="watchlist-loading">
          <div className="loading-spinner"></div>
          <p>Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <p>Keep track of movies and shows you want to watch</p>
        {watchlist.length > 0 && (
          <div className="watchlist-stats">
            <span className="stat">
              <strong>{watchlist.length}</strong> items total
            </span>
            <span className="stat">
              <strong>{watchlist.filter(item => item.media_type === 'movie').length}</strong> movies
            </span>
            <span className="stat">
              <strong>{watchlist.filter(item => item.media_type === 'tv').length}</strong> TV shows
            </span>
          </div>
        )}
      </div>

      {watchlist.length > 0 && (
        <>
          <div className="watchlist-controls">
            <div className="watchlist-filters">
              {filters.map((filterOption) => (
                <button
                  key={filterOption.key}
                  className={`filter-btn ${filter === filterOption.key ? 'active' : ''}`}
                  onClick={() => setFilter(filterOption.key)}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
            <button className="clear-btn" onClick={clearWatchlist}>
              Clear All
            </button>
          </div>

          <div className="watchlist-grid">
            {filteredWatchlist.map((item) => (
              <div key={item.id} className="watchlist-item">
                <MovieCard movie={item} />
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromWatchlist(item.id)}
                  title="Remove from watchlist"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div className="media-type-badge">
                  {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                </div>
              </div>
            ))}
          </div>

          {filteredWatchlist.length === 0 && filter !== 'all' && (
            <div className="no-filtered-items">
              <div className="no-items-icon">🎬</div>
              <h3>No {filter === 'movie' ? 'movies' : 'TV shows'} in your watchlist</h3>
              <p>Add some {filter === 'movie' ? 'movies' : 'TV shows'} to see them here.</p>
            </div>
          )}
        </>
      )}

      {watchlist.length === 0 && (
        <div className="empty-watchlist">
          <div className="empty-icon">📝</div>
          <h3>Your watchlist is empty</h3>
          <p>Start adding movies and TV shows you want to watch later.</p>
          <div className="empty-actions">
            <a href="/" className="browse-btn">
              Browse Movies
            </a>
            <a href="/series" className="browse-btn">
              Browse TV Shows
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;

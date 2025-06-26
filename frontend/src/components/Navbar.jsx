import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tmdbApi } from '../services/tmdbApi';
import { localStorageService } from '../services/localStorage';
import { FaUser, FaSignOutAlt, FaHeart, FaList, FaCog } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Recent searches for quick access
  const [recentSearches, setRecentSearches] = useState([]);

  // Auth context
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Load recent searches
    setRecentSearches(localStorageService.recentSearches.get());

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Real-time search as user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery);
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      setIsSearching(true);
      const response = await tmdbApi.searchMovies(query);
      setSearchResults(response.results || []);
      setShowResults(true);

      // Save to recent searches
      localStorageService.recentSearches.add(query);
      setRecentSearches(localStorageService.recentSearches.get());
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchActive(false);

      // Save to recent searches
      localStorageService.recentSearches.add(searchQuery.trim());
      setRecentSearches(localStorageService.recentSearches.get());
    }
  };

  const handleResultClick = (movie) => {
    console.log('Selected movie:', movie);

    // Navigate to search results page with the movie title
    navigate(`/search?q=${encodeURIComponent(movie.title)}`);

    setSearchQuery('');
    setShowResults(false);
    setSearchActive(false);

    // Save to recent searches
    localStorageService.recentSearches.add(movie.title);
    setRecentSearches(localStorageService.recentSearches.get());
  };

  const handleRecentSearchClick = (searchTerm) => {
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setSearchActive(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        alert('Voice search not available or permission denied');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in your browser');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Animated Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <div className="logo-container">
            <div className="logo-icon">
              <div className="film-strip">
                <div className="film-hole"></div>
                <div className="film-hole"></div>
                <div className="film-hole"></div>
              </div>
            </div>
            <div className="brand-text">
              <span className="brand-main">ENTERTAIN</span>
              <span className="brand-sub">HUB</span>
            </div>
          </div>
        </Link>

        {/* Futuristic Navigation Links */}
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              <span className="link-text">Home</span>
              <div className="link-glow"></div>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/movies" className="navbar-link">
              <span className="link-text">Movies</span>
              <div className="link-glow"></div>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/series" className="navbar-link">
              <span className="link-text">Series</span>
              <div className="link-glow"></div>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/trending" className="navbar-link">
              <span className="link-text">Trending</span>
              <div className="link-glow"></div>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/watchlist" className="navbar-link">
              <span className="link-text">Watchlist</span>
              <div className="link-glow"></div>
            </Link>
          </li>
        </ul>

        {/* Advanced Search */}
        <div className={`navbar-search ${searchActive ? 'search-active' : ''}`}>
          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search movies..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchActive(true)}
              onBlur={(e) => {
                // Delay hiding results to allow clicking on them
                setTimeout(() => setSearchActive(false), 200);
              }}
            />

            {/* Clear button */}
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={clearSearch}
                title="Clear Search"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            <button
              type="button"
              className={`voice-search-btn ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceSearch}
              title="Voice Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>

            <button
              type="submit"
              className="search-icon"
              title="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <div className="search-pulse"></div>
          </form>

          {/* Search Results Dropdown */}
          {(showResults || isSearching) && searchActive && (
            <div className="search-results">
              {isSearching ? (
                <div className="search-loading">
                  <div className="loading-spinner"></div>
                  <span>Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="results-header">
                    <span>Found {searchResults.length} results</span>
                  </div>
                  {searchResults.slice(0, 6).map((movie) => (
                    <div
                      key={movie.id}
                      className="search-result-item"
                      onClick={() => handleResultClick(movie)}
                    >
                      <div className="result-poster">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                            alt={movie.title}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="poster-placeholder" style={{ display: movie.poster_path ? 'none' : 'flex' }}>
                          🎬
                        </div>
                      </div>
                      <div className="result-info">
                        <div className="result-title">{movie.title}</div>
                        <div className="result-meta">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'} •
                          ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {searchResults.length > 6 && (
                    <div
                      className="results-footer clickable"
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchActive(false);
                      }}
                    >
                      <span>View all {searchResults.length} results →</span>
                    </div>
                  )}
                </>
              ) : searchQuery.trim() ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <span>No results found for "{searchQuery}"</span>
                </div>
              ) : recentSearches.length > 0 ? (
                <>
                  <div className="results-header">
                    <span>Recent Searches</span>
                  </div>
                  {recentSearches.slice(0, 5).map((searchTerm, index) => (
                    <div
                      key={index}
                      className="search-result-item recent-search"
                      onClick={() => handleRecentSearchClick(searchTerm)}
                    >
                      <div className="result-poster">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.35-4.35"></path>
                        </svg>
                      </div>
                      <div className="result-info">
                        <div className="result-title">{searchTerm}</div>
                        <div className="result-meta">Recent search</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <button className="notification-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="notification-dot"></span>
              </button>

              <div className="user-menu-container">
                <button
                  className="profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="avatar">
                    <div className="avatar-ring"></div>
                    <span>{user?.firstName?.[0] || user?.username?.[0] || 'U'}</span>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="user-menu">
                    <div className="user-info">
                      <div className="user-avatar">
                        <span>{user?.firstName?.[0] || user?.username?.[0] || 'U'}</span>
                      </div>
                      <div className="user-details">
                        <p className="user-name">{user?.fullName || user?.username}</p>
                        <p className="user-email">{user?.email}</p>
                      </div>
                    </div>

                    <div className="menu-divider"></div>

                    <div className="menu-items">
                      <Link to="/profile" className="menu-item">
                        <FaUser />
                        <span>Profile</span>
                      </Link>
                      <Link to="/favorites" className="menu-item">
                        <FaHeart />
                        <span>Favorites</span>
                      </Link>
                      <Link to="/watchlist" className="menu-item">
                        <FaList />
                        <span>Watchlist</span>
                      </Link>
                      <Link to="/settings" className="menu-item">
                        <FaCog />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <div className="menu-divider"></div>

                    <button className="menu-item logout-btn" onClick={logout}>
                      <FaSignOutAlt />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Sign In
              </Link>
              <Link to="/register" className="register-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Ambient Background Effects */}
      <div className="navbar-bg-effects">
        <div className="bg-particle particle-1"></div>
        <div className="bg-particle particle-2"></div>
        <div className="bg-particle particle-3"></div>
      </div>
    </nav>
  );
};

export default Navbar;

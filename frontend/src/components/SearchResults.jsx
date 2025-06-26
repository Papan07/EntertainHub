import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../services/tmdbApi';
import { moviesAPI } from '../services/api';
import MovieCard from './MovieCard';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState({
    tmdb: [],
    local: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchSource, setSearchSource] = useState('tmdb'); // 'tmdb' or 'local' or 'both'
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'rating', 'year', 'title'

  useEffect(() => {
    if (query) {
      performSearch(query, currentPage);
    }
  }, [query, currentPage, searchSource, sortBy]);

  const performSearch = async (searchQuery, page = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const promises = [];

      // Search TMDB if selected
      if (searchSource === 'tmdb' || searchSource === 'both') {
        promises.push(tmdbApi.searchMovies(searchQuery, page));
      }

      // Search local database if selected
      if (searchSource === 'local' || searchSource === 'both') {
        promises.push(
          moviesAPI.searchMovies(searchQuery, page).catch(err => {
            console.error('Local search error:', err);
            return { data: { movies: [], pagination: { totalPages: 1 } } };
          })
        );
      }

      const responses = await Promise.all(promises);
      
      let tmdbResults = [];
      let localResults = [];

      if (searchSource === 'tmdb') {
        tmdbResults = responses[0]?.results || [];
        setTotalPages(responses[0]?.total_pages || 1);
      } else if (searchSource === 'local') {
        const localResponse = responses[0];
        localResults = localResponse?.data?.movies || [];
        setTotalPages(localResponse?.data?.pagination?.totalPages || 1);
        console.log('Local search response:', localResponse);
      } else if (searchSource === 'both') {
        tmdbResults = responses[0]?.results || [];
        const localResponse = responses[1];
        localResults = localResponse?.data?.movies || [];
        setTotalPages(Math.max(responses[0]?.total_pages || 1, localResponse?.data?.pagination?.totalPages || 1));
        console.log('Both search - Local response:', localResponse);
      }

      // Sort results if needed
      if (sortBy !== 'relevance') {
        tmdbResults = sortResults(tmdbResults, sortBy);
        localResults = sortResults(localResults, sortBy);
      }

      setResults({
        tmdb: tmdbResults,
        local: localResults
      });

    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (movies, sortType) => {
    const sorted = [...movies];
    
    switch (sortType) {
      case 'rating':
        return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'year':
        return sorted.sort((a, b) => {
          const yearA = new Date(a.release_date || a.releaseDate || '1900').getFullYear();
          const yearB = new Date(b.release_date || b.releaseDate || '1900').getFullYear();
          return yearB - yearA;
        });
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  const getAllResults = () => {
    const allResults = [];
    
    if (searchSource === 'tmdb' || searchSource === 'both') {
      allResults.push(...results.tmdb);
    }
    
    if (searchSource === 'local' || searchSource === 'both') {
      allResults.push(...results.local);
    }
    
    return allResults;
  };

  const totalResults = getAllResults().length;

  if (!query) {
    return (
      <div className="search-results-page">
        <div className="search-container">
          <div className="no-query">
            <h2>Search Movies</h2>
            <p>Enter a search term to find movies</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-container">
        {/* Search Header */}
        <div className="search-header">
          <div className="search-info">
            <h1>Search Results</h1>
            <p className="search-query">
              {loading ? 'Searching...' : `${totalResults} results for "${query}"`}
            </p>
          </div>

          {/* Search Controls */}
          <div className="search-controls">
            <div className="control-group">
              <label>Source:</label>
              <select 
                value={searchSource} 
                onChange={(e) => {
                  setSearchSource(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-select"
              >
                <option value="tmdb">TMDB Database</option>
                <option value="local">Local Database</option>
                <option value="both">Both Sources</option>
              </select>
            </div>

            <div className="control-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-select"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="year">Year</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching for movies...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="search-error">
            <p>{error}</p>
            <button onClick={() => performSearch(query, currentPage)} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {/* TMDB Results */}
            {(searchSource === 'tmdb' || searchSource === 'both') && results.tmdb.length > 0 && (
              <div className="results-section">
                {searchSource === 'both' && <h2 className="section-title">TMDB Results</h2>}
                <div className="movies-grid">
                  {results.tmdb.map((movie) => (
                    <MovieCard
                      key={`tmdb-${movie.id}`}
                      movie={movie}
                      size="medium"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Local Results */}
            {(searchSource === 'local' || searchSource === 'both') && results.local.length > 0 && (
              <div className="results-section">
                {searchSource === 'both' && <h2 className="section-title">Local Database Results</h2>}
                <div className="movies-grid">
                  {results.local.map((movie) => (
                    <MovieCard
                      key={`local-${movie._id || movie.id}`}
                      movie={movie}
                      size="medium"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {totalResults === 0 && (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No movies found</h3>
                <p>Try searching with different keywords or check your spelling.</p>
                <div className="search-suggestions">
                  <p>Suggestions:</p>
                  <ul>
                    <li>Use more general terms</li>
                    <li>Check for typos</li>
                    <li>Try searching by actor or director name</li>
                    <li>Search in both TMDB and local database</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalResults > 0 && totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdbApi';

const SearchTest = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState({
    inputWorking: false,
    apiWorking: false,
    eventsWorking: false
  });

  // Test 1: Input functionality
  useEffect(() => {
    setTestResults(prev => ({
      ...prev,
      inputWorking: true
    }));
  }, [searchQuery]);

  // Test 2: API functionality
  const testSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await tmdbApi.searchMovies(query);
      setSearchResults(response.results || []);
      setTestResults(prev => ({
        ...prev,
        apiWorking: true
      }));
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed: ' + err.message);
      setTestResults(prev => ({
        ...prev,
        apiWorking: false
      }));
    } finally {
      setIsSearching(false);
    }
  };

  // Test 3: Event handling
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setTestResults(prev => ({
      ...prev,
      eventsWorking: true
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    testSearch(searchQuery);
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '100px auto 20px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      color: 'white'
    }}>
      <h2>EntertainHub Search Functionality Test</h2>
      
      {/* Test Status */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Test Status:</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            padding: '10px',
            borderRadius: '8px',
            background: testResults.inputWorking ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'
          }}>
            {testResults.inputWorking ? '✅' : '❌'} Input Field: {testResults.inputWorking ? 'Working' : 'Not Working'}
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '8px',
            background: testResults.eventsWorking ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'
          }}>
            {testResults.eventsWorking ? '✅' : '❌'} Events: {testResults.eventsWorking ? 'Working' : 'Not Working'}
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '8px',
            background: testResults.apiWorking ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 255, 0, 0.2)'
          }}>
            {testResults.apiWorking ? '✅' : '⏳'} API: {testResults.apiWorking ? 'Working' : 'Not Tested'}
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Enter a movie name (e.g., 'Batman', 'Inception')..."
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#ff6b6b',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              opacity: (isSearching || !searchQuery.trim()) ? 0.6 : 1
            }}
          >
            {isSearching ? 'Searching...' : 'Test Search'}
          </button>
        </div>
      </form>

      {/* Current Input Value */}
      <div style={{ marginBottom: '20px', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
        <strong>Current Input Value:</strong> "{searchQuery}"
        <br />
        <strong>Input Length:</strong> {searchQuery.length} characters
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '10px',
          background: 'rgba(255, 0, 0, 0.2)',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#ff6b6b'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results ({searchResults.length} found):</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {searchResults.slice(0, 5).map((movie) => (
              <div
                key={movie.id}
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <div style={{
                  width: '50px',
                  height: '75px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    '🎬'
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{movie.title}</div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'} • 
                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
        <h4>Test Instructions:</h4>
        <ol>
          <li>Try typing in the search input field above</li>
          <li>Enter a movie name (like "Batman", "Inception", "Avengers")</li>
          <li>Click "Test Search" to test the TMDB API integration</li>
          <li>Check the test status indicators above</li>
        </ol>
        <p><strong>Expected Results:</strong></p>
        <ul>
          <li>✅ Input Field should turn green when you type</li>
          <li>✅ Events should turn green when you interact with the input</li>
          <li>✅ API should turn green when search returns results</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchTest;

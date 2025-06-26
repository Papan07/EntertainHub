import React, { useState, useEffect } from 'react';
import { localStorageService } from '../services/localStorage';
import MovieCard from './MovieCard';
import './FavoritesWatchlist.css';

const FavoritesWatchlist = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setFavorites(localStorageService.favorites.get());
    setWatchlist(localStorageService.watchlist.get());
  };

  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      localStorageService.favorites.clear();
      loadData();
    }
  };

  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      localStorageService.watchlist.clear();
      loadData();
    }
  };

  const handleExportData = () => {
    const data = localStorageService.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'entertainhub-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (localStorageService.importData(data)) {
            loadData();
            alert('Data imported successfully!');
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        } catch (error) {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const EmptyState = ({ type, onClear }) => (
    <div className="empty-state">
      <div className="empty-icon">
        {type === 'favorites' ? '💝' : '📋'}
      </div>
      <h3>No {type} yet</h3>
      <p>
        {type === 'favorites' 
          ? 'Movies you mark as favorites will appear here'
          : 'Movies you add to your watchlist will appear here'
        }
      </p>
      <button className="browse-btn" onClick={() => window.scrollTo(0, 0)}>
        Browse Movies
      </button>
    </div>
  );

  const currentData = activeTab === 'favorites' ? favorites : watchlist;
  const currentClearHandler = activeTab === 'favorites' ? handleClearFavorites : handleClearWatchlist;

  return (
    <div className="favorites-watchlist">
      <div className="container">
        <div className="header">
          <h1>My Collection</h1>
          <div className="header-actions">
            <button className="export-btn" onClick={handleExportData}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Data
            </button>
            
            <label className="import-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17,8 12,3 7,8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Import Data
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Favorites ({favorites.length})
          </button>
          
          <button 
            className={`tab ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            Watchlist ({watchlist.length})
          </button>
        </div>

        <div className="content">
          {currentData.length > 0 ? (
            <>
              <div className="content-header">
                <h2>
                  {activeTab === 'favorites' ? 'Your Favorite Movies' : 'Your Watchlist'}
                </h2>
                <button className="clear-btn" onClick={currentClearHandler}>
                  Clear All
                </button>
              </div>
              
              <div className="movies-grid">
                {currentData.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    size="medium"
                    showDetails={true}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState type={activeTab} />
          )}
        </div>

        {/* Storage Info */}
        <div className="storage-info">
          <div className="storage-stats">
            <div className="stat">
              <span className="stat-label">Favorites:</span>
              <span className="stat-value">{favorites.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Watchlist:</span>
              <span className="stat-value">{watchlist.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Storage Used:</span>
              <span className="stat-value">{(localStorageService.getStorageSize() / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesWatchlist;

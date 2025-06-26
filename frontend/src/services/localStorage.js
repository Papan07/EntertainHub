// Local Storage Service for EntertainHub
const STORAGE_KEYS = {
  FAVORITES: 'entertainhub_favorites',
  WATCHLIST: 'entertainhub_watchlist',
  RECENT_SEARCHES: 'entertainhub_recent_searches',
  USER_PREFERENCES: 'entertainhub_preferences'
};

// Helper function to safely parse JSON from localStorage
const safeJsonParse = (item, fallback = []) => {
  try {
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error('Error parsing JSON from localStorage:', error);
    return fallback;
  }
};

// Helper function to safely stringify and store JSON
const safeJsonStringify = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error storing data to localStorage:', error);
    return false;
  }
};

export const localStorageService = {
  // Favorites management
  favorites: {
    get: () => {
      const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return safeJsonParse(favorites, []);
    },

    add: (movie) => {
      const favorites = localStorageService.favorites.get();
      const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          addedAt: new Date().toISOString()
        }];
        return safeJsonStringify(STORAGE_KEYS.FAVORITES, updatedFavorites);
      }
      return false;
    },

    remove: (movieId) => {
      const favorites = localStorageService.favorites.get();
      const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
      return safeJsonStringify(STORAGE_KEYS.FAVORITES, updatedFavorites);
    },

    isFavorite: (movieId) => {
      const favorites = localStorageService.favorites.get();
      return favorites.some(fav => fav.id === movieId);
    },

    clear: () => {
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    }
  },

  // Watchlist management
  watchlist: {
    get: () => {
      const watchlist = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return safeJsonParse(watchlist, []);
    },

    add: (movie) => {
      const watchlist = localStorageService.watchlist.get();
      const isAlreadyInWatchlist = watchlist.some(item => item.id === movie.id);
      
      if (!isAlreadyInWatchlist) {
        const updatedWatchlist = [...watchlist, {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          addedAt: new Date().toISOString()
        }];
        return safeJsonStringify(STORAGE_KEYS.WATCHLIST, updatedWatchlist);
      }
      return false;
    },

    remove: (movieId) => {
      const watchlist = localStorageService.watchlist.get();
      const updatedWatchlist = watchlist.filter(item => item.id !== movieId);
      return safeJsonStringify(STORAGE_KEYS.WATCHLIST, updatedWatchlist);
    },

    isInWatchlist: (movieId) => {
      const watchlist = localStorageService.watchlist.get();
      return watchlist.some(item => item.id === movieId);
    },

    clear: () => {
      localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
    }
  },

  // Recent searches management
  recentSearches: {
    get: () => {
      const searches = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return safeJsonParse(searches, []);
    },

    add: (searchTerm) => {
      if (!searchTerm || searchTerm.trim().length === 0) return false;
      
      const searches = localStorageService.recentSearches.get();
      const filteredSearches = searches.filter(term => term !== searchTerm.trim());
      const updatedSearches = [searchTerm.trim(), ...filteredSearches].slice(0, 10); // Keep only last 10 searches
      
      return safeJsonStringify(STORAGE_KEYS.RECENT_SEARCHES, updatedSearches);
    },

    clear: () => {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    }
  },

  // User preferences management
  preferences: {
    get: () => {
      const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return safeJsonParse(preferences, {
        theme: 'dark',
        language: 'en',
        autoplay: false,
        notifications: true
      });
    },

    update: (newPreferences) => {
      const currentPreferences = localStorageService.preferences.get();
      const updatedPreferences = { ...currentPreferences, ...newPreferences };
      return safeJsonStringify(STORAGE_KEYS.USER_PREFERENCES, updatedPreferences);
    },

    reset: () => {
      localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    }
  },

  // Utility functions
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  getStorageSize: () => {
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        total += item.length;
      }
    });
    return total;
  },

  exportData: () => {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const item = localStorage.getItem(key);
      if (item) {
        data[name] = safeJsonParse(item);
      }
    });
    return data;
  },

  importData: (data) => {
    try {
      Object.entries(data).forEach(([name, value]) => {
        const key = STORAGE_KEYS[name];
        if (key) {
          safeJsonStringify(key, value);
        }
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
};

export default localStorageService;

import axios from 'axios';
import toast from 'react-hot-toast';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = () => localStorage.getItem('entertainhub_token');
const setToken = (token) => localStorage.setItem('entertainhub_token', token);
const removeToken = () => localStorage.removeItem('entertainhub_token');

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired or invalid
      removeToken();
      toast.error('Session expired. Please login again.');
      // Redirect to login page
      window.location.href = '/login';
    } else if (response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    } else if (response?.status === 404) {
      toast.error('Resource not found.');
    } else if (response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (response?.data?.message) {
      toast.error(response.data.message);
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      setToken(response.data.data.token);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      setToken(response.data.data.token);
    }
    return response.data;
  },

  logout: () => {
    removeToken();
    toast.success('Logged out successfully');
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    if (response.data.success && response.data.data.token) {
      setToken(response.data.data.token);
    }
    return response.data;
  }
};

// Movies API
export const moviesAPI = {
  getMovies: async (params = {}) => {
    const response = await api.get('/movies', { params });
    return response.data;
  },

  getMovie: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  searchMovies: async (query, page = 1) => {
    const response = await api.get('/movies/search', {
      params: { q: query, page }
    });
    return response.data;
  },

  getTrending: async (limit = 20) => {
    const response = await api.get('/movies/trending', {
      params: { limit }
    });
    return response.data;
  },

  getFeatured: async (limit = 10) => {
    const response = await api.get('/movies/featured', {
      params: { limit }
    });
    return response.data;
  },

  createMovie: async (movieData) => {
    const response = await api.post('/movies', movieData);
    return response.data;
  },

  updateMovie: async (id, movieData) => {
    const response = await api.put(`/movies/${id}`, movieData);
    return response.data;
  },

  deleteMovie: async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  }
};

// Reviews API
export const reviewsAPI = {
  getReviews: async (params = {}) => {
    const response = await api.get('/reviews', { params });
    return response.data;
  },

  getMovieReviews: async (movieId, params = {}) => {
    const response = await api.get(`/reviews/movie/${movieId}`, { params });
    return response.data;
  },

  getUserReviews: async (userId, params = {}) => {
    const response = await api.get(`/reviews/user/${userId}`, { params });
    return response.data;
  },

  getReview: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  likeReview: async (id) => {
    const response = await api.post(`/reviews/${id}/like`);
    return response.data;
  },

  dislikeReview: async (id) => {
    const response = await api.post(`/reviews/${id}/dislike`);
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getFavorites: async (params = {}) => {
    const response = await api.get('/users/favorites', { params });
    return response.data;
  },

  addToFavorites: async (movieId) => {
    const response = await api.post(`/users/favorites/${movieId}`);
    return response.data;
  },

  removeFromFavorites: async (movieId) => {
    const response = await api.delete(`/users/favorites/${movieId}`);
    return response.data;
  },

  getWatchlist: async (params = {}) => {
    const response = await api.get('/users/watchlist', { params });
    return response.data;
  },

  addToWatchlist: async (movieId) => {
    const response = await api.post(`/users/watchlist/${movieId}`);
    return response.data;
  },

  removeFromWatchlist: async (movieId) => {
    const response = await api.delete(`/users/watchlist/${movieId}`);
    return response.data;
  },

  getWatchlists: async () => {
    const response = await api.get('/users/watchlists');
    return response.data;
  },

  createWatchlist: async (watchlistData) => {
    const response = await api.post('/users/watchlists', watchlistData);
    return response.data;
  },

  getWatchlist: async (id) => {
    const response = await api.get(`/users/watchlists/${id}`);
    return response.data;
  },

  addMovieToWatchlist: async (watchlistId, movieId, options = {}) => {
    const response = await api.post(`/users/watchlists/${watchlistId}/movies/${movieId}`, options);
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  }
};

// Utility functions
export const isAuthenticated = () => {
  return !!getToken();
};

export const getCurrentUser = async () => {
  if (!isAuthenticated()) return null;
  
  try {
    const response = await authAPI.getProfile();
    return response.data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export default api;

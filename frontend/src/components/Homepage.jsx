import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import MovieCarousel from './MovieCarousel';
import { tmdbApi } from '../services/tmdbApi';
import './Homepage.css';

const Homepage = () => {
  const [loading, setLoading] = useState({
    trending: true,
    popular: true,
    topRated: true,
    upcoming: true,
    featured: true
  });

  const [movies, setMovies] = useState({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
    featured: []
  });

  const [errors, setErrors] = useState({
    trending: null,
    popular: null,
    topRated: null,
    upcoming: null,
    featured: null
  });

  useEffect(() => {
    loadAllMovies();
  }, []);

  const loadAllMovies = async () => {
    // Load all movie categories
    await Promise.all([
      loadTrending(),
      loadPopular(),
      loadTopRated(),
      loadUpcoming()
    ]);
  };

  const loadTrending = async () => {
    try {
      setLoading(prev => ({ ...prev, trending: true }));
      const response = await tmdbApi.getTrending('week');
      setMovies(prev => ({ 
        ...prev, 
        trending: response.results || [],
        featured: response.results?.slice(0, 3) || [] // Use first 3 trending movies as featured
      }));
      setErrors(prev => ({ ...prev, trending: null, featured: null }));
    } catch (error) {
      console.error('Error loading trending movies:', error);
      setErrors(prev => ({ ...prev, trending: error.message, featured: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, trending: false, featured: false }));
    }
  };

  const loadPopular = async () => {
    try {
      setLoading(prev => ({ ...prev, popular: true }));
      const response = await tmdbApi.getPopular();
      setMovies(prev => ({ ...prev, popular: response.results || [] }));
      setErrors(prev => ({ ...prev, popular: null }));
    } catch (error) {
      console.error('Error loading popular movies:', error);
      setErrors(prev => ({ ...prev, popular: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, popular: false }));
    }
  };

  const loadTopRated = async () => {
    try {
      setLoading(prev => ({ ...prev, topRated: true }));
      const response = await tmdbApi.getTopRated();
      setMovies(prev => ({ ...prev, topRated: response.results || [] }));
      setErrors(prev => ({ ...prev, topRated: null }));
    } catch (error) {
      console.error('Error loading top rated movies:', error);
      setErrors(prev => ({ ...prev, topRated: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, topRated: false }));
    }
  };

  const loadUpcoming = async () => {
    try {
      setLoading(prev => ({ ...prev, upcoming: true }));
      const response = await tmdbApi.getUpcoming();
      setMovies(prev => ({ ...prev, upcoming: response.results || [] }));
      setErrors(prev => ({ ...prev, upcoming: null }));
    } catch (error) {
      console.error('Error loading upcoming movies:', error);
      setErrors(prev => ({ ...prev, upcoming: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, upcoming: false }));
    }
  };

  const handleViewAll = (category) => {
    console.log(`View all ${category} movies`);
    // Implement navigation to category page
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <HeroSection 
        featuredMovies={movies.featured}
        loading={loading.featured}
      />

      {/* Movie Sections */}
      <div className="homepage-content">
        {/* Trending Now */}
        <MovieCarousel
          title="Trending Now"
          movies={movies.trending}
          loading={loading.trending}
          error={errors.trending}
          cardSize="medium"
          onViewAll={() => handleViewAll('trending')}
        />

        {/* Popular Movies */}
        <MovieCarousel
          title="Popular Movies"
          movies={movies.popular}
          loading={loading.popular}
          error={errors.popular}
          cardSize="medium"
          onViewAll={() => handleViewAll('popular')}
        />

        {/* Top Rated */}
        <MovieCarousel
          title="Top Rated"
          movies={movies.topRated}
          loading={loading.topRated}
          error={errors.topRated}
          cardSize="medium"
          onViewAll={() => handleViewAll('topRated')}
        />

        {/* Coming Soon */}
        <MovieCarousel
          title="Coming Soon"
          movies={movies.upcoming}
          loading={loading.upcoming}
          error={errors.upcoming}
          cardSize="medium"
          onViewAll={() => handleViewAll('upcoming')}
        />
      </div>

      {/* Quick Stats Section */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">
              {movies.popular.length + movies.trending.length + movies.topRated.length + movies.upcoming.length}
            </div>
            <div className="stat-label">Movies Available</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">4.8</div>
            <div className="stat-label">Average Rating</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Users</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Streaming</div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Movie Journey?</h2>
          <p>Join thousands of movie lovers and discover your next favorite film</p>
          <div className="cta-actions">
            <button className="cta-btn primary">
              Get Started Free
            </button>
            <button className="cta-btn secondary">
              Browse Movies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

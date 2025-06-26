// TMDB API Service
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// You'll need to get your own API key from https://www.themoviedb.org/settings/api
const TMDB_API_KEY = '80079acbf1a84209966e8b576eeac8a7'; // Replace with your actual API key

// For demo purposes, we'll use a fallback system with sample data
const USE_SAMPLE_DATA = !TMDB_API_KEY || TMDB_API_KEY === 'your_api_key_here';

// Debug logging
console.log('TMDB_API_KEY:', TMDB_API_KEY ? 'Present' : 'Missing');
console.log('USE_SAMPLE_DATA:', USE_SAMPLE_DATA);

// Sample movie data for development/demo
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    release_date: "2008-07-18",
    vote_average: 9.0,
    genre_ids: [28, 80, 18],
    popularity: 123.456
  },
  {
    id: 2,
    title: "Inception",
    overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    release_date: "2010-07-16",
    vote_average: 8.8,
    genre_ids: [28, 878, 53],
    popularity: 98.765
  },
  {
    id: 3,
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/pbrkL804c8yAv3zBZR4QPWZAAn8.jpg",
    release_date: "2014-11-07",
    vote_average: 8.6,
    genre_ids: [18, 878],
    popularity: 87.432
  },
  {
    id: 4,
    title: "The Matrix",
    overview: "A computer programmer discovers that reality as he knows it is a simulation controlled by machines.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    release_date: "1999-03-31",
    vote_average: 8.7,
    genre_ids: [28, 878],
    popularity: 76.543
  },
  {
    id: 5,
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
    release_date: "1994-10-14",
    vote_average: 8.9,
    genre_ids: [80, 18],
    popularity: 65.321
  },
  {
    id: 6,
    title: "Avatar",
    overview: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following orders and protecting an alien civilization.",
    poster_path: "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    backdrop_path: "/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg",
    release_date: "2009-12-18",
    vote_average: 7.9,
    genre_ids: [28, 12, 14, 878],
    popularity: 89.654
  }
];

// Sample TV shows data
const SAMPLE_TV_SHOWS = [
  {
    id: 101,
    name: "Breaking Bad",
    title: "Breaking Bad",
    overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    first_air_date: "2008-01-20",
    release_date: "2008-01-20",
    vote_average: 9.5,
    genre_ids: [18, 80],
    popularity: 150.789
  },
  {
    id: 102,
    name: "Game of Thrones",
    title: "Game of Thrones",
    overview: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    poster_path: "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    backdrop_path: "/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    first_air_date: "2011-04-17",
    release_date: "2011-04-17",
    vote_average: 9.3,
    genre_ids: [18, 10765, 10759],
    popularity: 140.567
  },
  {
    id: 103,
    name: "Stranger Things",
    title: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces.",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    first_air_date: "2016-07-15",
    release_date: "2016-07-15",
    vote_average: 8.7,
    genre_ids: [18, 10765, 9648],
    popularity: 130.234
  },
  {
    id: 104,
    name: "The Office",
    title: "The Office",
    overview: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior.",
    poster_path: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    backdrop_path: "/7XwLhfhO9BYqikN8KlayTQjJhnt.jpg",
    first_air_date: "2005-03-24",
    release_date: "2005-03-24",
    vote_average: 8.9,
    genre_ids: [35],
    popularity: 120.456
  },
  {
    id: 105,
    name: "The Crown",
    title: "The Crown",
    overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
    poster_path: "/1M876KPjulVwppEpldhdc8V4o68.jpg",
    backdrop_path: "/wHa6KOJAoNTFLFtp7wguUJKSnju.jpg",
    first_air_date: "2016-11-04",
    release_date: "2016-11-04",
    vote_average: 8.6,
    genre_ids: [18, 36],
    popularity: 110.789
  },
  {
    id: 106,
    name: "Friends",
    title: "Friends",
    overview: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
    poster_path: "/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    backdrop_path: "/l0qVZIpXtIo7km9u5Yqh0nKPOr5.jpg",
    first_air_date: "1994-09-22",
    release_date: "1994-09-22",
    vote_average: 8.9,
    genre_ids: [35, 18],
    popularity: 100.123
  }
];

// Sample trending content (mix of movies and TV shows)
const SAMPLE_TRENDING = [
  { ...SAMPLE_MOVIES[0], media_type: 'movie' },
  { ...SAMPLE_TV_SHOWS[0], media_type: 'tv' },
  { ...SAMPLE_MOVIES[1], media_type: 'movie' },
  { ...SAMPLE_TV_SHOWS[1], media_type: 'tv' },
  { ...SAMPLE_MOVIES[2], media_type: 'movie' },
  { ...SAMPLE_TV_SHOWS[2], media_type: 'tv' }
];

// API request helper with error handling - Enhanced with debugging
const apiRequest = async (endpoint, options = {}) => {
  console.log('API Request - USE_SAMPLE_DATA:', USE_SAMPLE_DATA);
  console.log('API Request - Endpoint:', endpoint);
  console.log('API Request - Options:', options);

  if (USE_SAMPLE_DATA) {
    console.log('Using sample data for:', endpoint);
    // Return sample data for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ results: SAMPLE_MOVIES, total_pages: 1, total_results: SAMPLE_MOVIES.length });
      }, 500); // Simulate API delay
    });
  }

  try {
    const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&${new URLSearchParams(options)}`;
    console.log('Making API request to:', url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('TMDB API Error:', error);
    // Fallback to sample data on error
    console.log('Falling back to sample data due to error');
    return { results: SAMPLE_MOVIES, total_pages: 1, total_results: SAMPLE_MOVIES.length };
  }
};

// Get image URL helper - Fixed
export const getImageUrl = (path, size = 'w500') => {
  if (!path) {
    // Return a better placeholder image
    return `https://via.placeholder.com/500x750/1a1a2e/ffffff?text=${encodeURIComponent('No Image')}`;
  }

  if (USE_SAMPLE_DATA) {
    // For sample data, return a movie-themed placeholder
    return `https://via.placeholder.com/500x750/1a1a2e/ffffff?text=${encodeURIComponent('Sample Movie')}`;
  }

  // Return actual TMDB image URL
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// API functions
export const tmdbApi = {
  // Get trending content (movies and TV shows)
  getTrending: async (timeWindow = 'day') => {
    if (USE_SAMPLE_DATA) {
      return { results: SAMPLE_TRENDING, total_pages: 1 };
    }
    return apiRequest(`/trending/all/${timeWindow}`);
  },

  // MOVIE METHODS
  // Get popular movies
  getPopular: async (page = 1) => {
    if (USE_SAMPLE_DATA) {
      return { results: SAMPLE_MOVIES, total_pages: 1 };
    }
    return apiRequest('/movie/popular', { page });
  },

  getPopularMovies: async (page = 1) => {
    return tmdbApi.getPopular(page);
  },

  // Get top rated movies
  getTopRated: async (page = 1) => {
    if (USE_SAMPLE_DATA) {
      return { results: SAMPLE_MOVIES.sort((a, b) => b.vote_average - a.vote_average), total_pages: 1 };
    }
    return apiRequest('/movie/top_rated', { page });
  },

  getTopRatedMovies: async (page = 1) => {
    return tmdbApi.getTopRated(page);
  },

  // Get upcoming movies
  getUpcoming: async (page = 1) => {
    if (USE_SAMPLE_DATA) {
      return { results: SAMPLE_MOVIES.slice(2), total_pages: 1 };
    }
    return apiRequest('/movie/upcoming', { page });
  },

  getUpcomingMovies: async (page = 1) => {
    return tmdbApi.getUpcoming(page);
  },

  // Get now playing movies
  getNowPlayingMovies: async (page = 1) => {
    if (USE_SAMPLE_DATA) {
      return { results: SAMPLE_MOVIES.slice(0, 4), total_pages: 1 };
    }
    return apiRequest('/movie/now_playing', { page });
  },

  // TV SHOW METHODS
  // Get popular TV shows
  getPopularTVShows: async (page = 1) => {
    if (USE_SAMPLE_DATA) {
      return { results: SAMPLE_TV_SHOWS, total_pages: 1 };
    }
    return apiRequest('/tv/popular', { page });
  },

  // Get top rated TV shows
  getTopRatedTVShows: async (page = 1) => {
    if (USE_SAMPLE_DATA) {
      return { results: SAMPLE_TV_SHOWS.sort((a, b) => b.vote_average - a.vote_average), total_pages: 1 };
    }
    return apiRequest('/tv/top_rated', { page });
  },

  // Get on the air TV shows
  getOnTheAirTVShows: async (page = 1) => {
    if (USE_SAMPLE_DATA) {
      return { results: SAMPLE_TV_SHOWS.slice(0, 4), total_pages: 1 };
    }
    return apiRequest('/tv/on_the_air', { page });
  },

  // Get airing today TV shows
  getAiringTodayTVShows: async (page = 1) => {
    if (USE_SAMPLE_DATA) {
      return { results: SAMPLE_TV_SHOWS.slice(2), total_pages: 1 };
    }
    return apiRequest('/tv/airing_today', { page });
  },

  // SEARCH METHODS
  // Search movies
  searchMovies: async (query, page = 1) => {
    if (USE_SAMPLE_DATA) {
      const filtered = SAMPLE_MOVIES.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase())
      );
      return { results: filtered, total_pages: 1 };
    }
    return apiRequest('/search/movie', { query, page });
  },

  // Search TV shows
  searchTVShows: async (query, page = 1) => {
    if (USE_SAMPLE_DATA) {
      const filtered = SAMPLE_TV_SHOWS.filter(show =>
        show.name.toLowerCase().includes(query.toLowerCase()) ||
        show.overview.toLowerCase().includes(query.toLowerCase())
      );
      return { results: filtered, total_pages: 1 };
    }
    return apiRequest('/search/tv', { query, page });
  },

  // Search all (movies and TV shows)
  searchAll: async (query, page = 1) => {
    if (USE_SAMPLE_DATA) {
      const movieResults = SAMPLE_MOVIES.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase())
      ).map(movie => ({ ...movie, media_type: 'movie' }));

      const tvResults = SAMPLE_TV_SHOWS.filter(show =>
        show.name.toLowerCase().includes(query.toLowerCase()) ||
        show.overview.toLowerCase().includes(query.toLowerCase())
      ).map(show => ({ ...show, media_type: 'tv' }));

      return { results: [...movieResults, ...tvResults], total_pages: 1 };
    }
    return apiRequest('/search/multi', { query, page });
  },

  // DETAILS METHODS
  // Get movie details
  getMovieDetails: async (movieId) => {
    if (USE_SAMPLE_DATA) {
      return SAMPLE_MOVIES.find(movie => movie.id === parseInt(movieId)) || SAMPLE_MOVIES[0];
    }
    return apiRequest(`/movie/${movieId}`);
  },

  // Get TV show details
  getTVShowDetails: async (tvId) => {
    if (USE_SAMPLE_DATA) {
      return SAMPLE_TV_SHOWS.find(show => show.id === parseInt(tvId)) || SAMPLE_TV_SHOWS[0];
    }
    return apiRequest(`/tv/${tvId}`);
  },

  // GENRE METHODS
  // Get movie genres
  getGenres: async () => {
    if (USE_SAMPLE_DATA) {
      return {
        genres: [
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
          { id: 16, name: "Animation" },
          { id: 35, name: "Comedy" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 18, name: "Drama" },
          { id: 10751, name: "Family" },
          { id: 14, name: "Fantasy" },
          { id: 36, name: "History" },
          { id: 27, name: "Horror" },
          { id: 10402, name: "Music" },
          { id: 9648, name: "Mystery" },
          { id: 10749, name: "Romance" },
          { id: 878, name: "Science Fiction" },
          { id: 10770, name: "TV Movie" },
          { id: 53, name: "Thriller" },
          { id: 10752, name: "War" },
          { id: 37, name: "Western" }
        ]
      };
    }
    return apiRequest('/genre/movie/list');
  },

  // Get TV genres
  getTVGenres: async () => {
    if (USE_SAMPLE_DATA) {
      return {
        genres: [
          { id: 10759, name: "Action & Adventure" },
          { id: 16, name: "Animation" },
          { id: 35, name: "Comedy" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 18, name: "Drama" },
          { id: 10751, name: "Family" },
          { id: 10762, name: "Kids" },
          { id: 9648, name: "Mystery" },
          { id: 10763, name: "News" },
          { id: 10764, name: "Reality" },
          { id: 10765, name: "Sci-Fi & Fantasy" },
          { id: 10766, name: "Soap" },
          { id: 10767, name: "Talk" },
          { id: 10768, name: "War & Politics" },
          { id: 37, name: "Western" }
        ]
      };
    }
    return apiRequest('/genre/tv/list');
  }
};

export default tmdbApi;

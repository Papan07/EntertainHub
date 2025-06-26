# TMDB API Setup Guide for EntertainHub

## Overview
EntertainHub uses The Movie Database (TMDB) API to fetch real movie data. This guide will help you set up the API integration.

## Getting Your TMDB API Key

### Step 1: Create a TMDB Account
1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Request API Access
1. Log in to your TMDB account
2. Go to your account settings: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
3. Click "Create" under "Request an API Key"
4. Choose "Developer" option
5. Fill out the application form:
   - **Application Name**: EntertainHub (or your preferred name)
   - **Application URL**: http://localhost:3000 (for development)
   - **Application Summary**: Personal movie discovery application built with React

### Step 3: Get Your API Key
1. Once approved (usually instant), you'll receive your API key
2. Copy the "API Key (v3 auth)" - this is what you'll use

## Setting Up the API Key in Your Project

### Option 1: Direct Replacement (Quick Setup)
1. Open `frontend/src/services/tmdbApi.js`
2. Find this line:
   ```javascript
   const TMDB_API_KEY = 'your_api_key_here';
   ```
3. Replace `'your_api_key_here'` with your actual API key:
   ```javascript
   const TMDB_API_KEY = 'your_actual_api_key_here';
   ```

### Option 2: Environment Variables (Recommended for Production)
1. Create a `.env` file in the `frontend` directory:
   ```
   REACT_APP_TMDB_API_KEY=your_actual_api_key_here
   ```
2. Update `tmdbApi.js` to use the environment variable:
   ```javascript
   const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'your_api_key_here';
   ```
3. Add `.env` to your `.gitignore` file to keep your API key secure

## Testing the API Integration

### Without API Key (Demo Mode)
- The app will work with sample data
- You'll see placeholder movie posters
- Limited to 6 sample movies

### With API Key (Full Functionality)
- Real movie data from TMDB
- High-quality movie posters
- Thousands of movies available
- Real-time search functionality
- Up-to-date movie information

## API Features Available

### Movie Data
- **Popular Movies**: Currently trending movies
- **Top Rated**: Highest-rated movies of all time
- **Upcoming**: Movies coming to theaters soon
- **Trending**: Movies trending this week
- **Search**: Search through TMDB's entire database

### Movie Information
- Title, overview, release date
- Vote average (ratings)
- High-quality poster images
- Backdrop images for hero sections
- Genre information

## API Rate Limits

TMDB API has the following limits:
- **Free Tier**: 1,000 requests per day
- **Rate Limit**: 40 requests per 10 seconds

The app includes built-in caching and error handling to work within these limits.

## Troubleshooting

### Common Issues

1. **"Invalid API key" Error**
   - Double-check your API key is correct
   - Ensure there are no extra spaces
   - Verify your TMDB account is verified

2. **Images Not Loading**
   - Check your internet connection
   - Verify the API key is working
   - Images may take time to load on slower connections

3. **Search Not Working**
   - Ensure API key is set up correctly
   - Check browser console for error messages
   - Try refreshing the page

### Fallback Mode
If the API is unavailable, the app automatically falls back to sample data, so users can still experience the interface.

## Security Notes

- **Never commit your API key to version control**
- Use environment variables for production
- The TMDB API key is safe to use in frontend applications
- Consider implementing a backend proxy for additional security in production

## API Documentation

For more advanced features, check the official TMDB API documentation:
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [API Reference](https://developers.themoviedb.org/3/getting-started/introduction)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure your internet connection is stable
4. Check TMDB's status page for service issues

## Next Steps

Once your API is set up:
1. Restart your development server
2. Test the search functionality
3. Browse different movie categories
4. Try adding movies to favorites/watchlist
5. Explore the responsive design on different devices

Enjoy your fully functional movie discovery application! 🎬

# 🎬 TMDB API Setup Guide for EntertainHub

This guide will help you set up The Movie Database (TMDB) API integration for your EntertainHub application.

## 📋 Table of Contents

1. [Getting Your TMDB API Key](#getting-your-tmdb-api-key)
2. [Environment Configuration](#environment-configuration)
3. [Testing the Integration](#testing-the-integration)
4. [API Usage Examples](#api-usage-examples)
5. [Rate Limiting & Best Practices](#rate-limiting--best-practices)
6. [Troubleshooting](#troubleshooting)

## 🔑 Getting Your TMDB API Key

### Step 1: Create a TMDB Account

1. Visit [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Click **"Join TMDB"** in the top right corner
3. Fill out the registration form with:
   - Username
   - Email address
   - Password
   - Confirm you're 13+ years old
4. Verify your email address

### Step 2: Request API Access

1. Log into your TMDB account
2. Go to your account settings by clicking your profile picture → **"Settings"**
3. In the left sidebar, click **"API"**
4. Click **"Create"** under "Request an API Key"
5. Choose **"Developer"** (free option)
6. Fill out the application form:
   - **Application Name**: EntertainHub
   - **Application URL**: http://localhost:3000 (or your domain)
   - **Application Summary**: Personal movie discovery and review application
7. Accept the terms of use
8. Submit your application

### Step 3: Get Your API Key

1. Once approved (usually instant), you'll see your API key
2. Copy the **API Key (v3 auth)** - this is what you'll use
3. Keep this key secure and never commit it to public repositories

## ⚙️ Environment Configuration

### Backend Configuration

1. Navigate to your backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file (if it doesn't exist):
   ```bash
   cp .env.example .env
   ```

3. Add your TMDB API key to the `.env` file:
   ```env
   # TMDB API Configuration
   TMDB_API_KEY=your_actual_api_key_here
   TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

### Frontend Configuration

1. Navigate to your frontend directory:
   ```bash
   cd frontend
   ```

2. Create a `.env` file (if it doesn't exist):
   ```bash
   cp .env.example .env
   ```

3. Add your TMDB API key to the `.env` file:
   ```env
   # TMDB API Configuration
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

## 🧪 Testing the Integration

### Test Backend Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:5001/health
   ```

3. You should see a response like:
   ```json
   {
     "success": true,
     "message": "EntertainHub API is running",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "environment": "development"
   }
   ```

### Test Frontend Connection

1. Start your frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open your browser and go to `http://localhost:5173`
3. Check the browser console for any TMDB API errors
4. The homepage should load with movie data (either from TMDB or fallback data)

### Test TMDB API Directly

You can test your API key directly with curl:

```bash
curl "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY"
```

Replace `YOUR_API_KEY` with your actual API key. You should get a JSON response with popular movies.

## 📚 API Usage Examples

### Popular Movies
```javascript
// Frontend usage
import { tmdbApi } from './services/tmdbApi';

const popularMovies = await tmdbApi.getPopular();
```

### Search Movies
```javascript
const searchResults = await tmdbApi.searchMovies('Inception');
```

### Movie Details
```javascript
const movieDetails = await tmdbApi.getMovieDetails(550); // Fight Club
```

### Trending Movies
```javascript
const trendingMovies = await tmdbApi.getTrending('movie', 'week');
```

## ⚡ Rate Limiting & Best Practices

### TMDB Rate Limits
- **40 requests per 10 seconds** per IP address
- **1,000 requests per day** for new accounts
- **Unlimited requests** for approved accounts

### Best Practices

1. **Implement Caching**:
   ```javascript
   // Cache responses for 5 minutes
   const cacheTime = 5 * 60 * 1000;
   ```

2. **Handle Errors Gracefully**:
   ```javascript
   try {
     const data = await tmdbApi.getPopular();
     return data;
   } catch (error) {
     console.error('TMDB API Error:', error);
     return fallbackData;
   }
   ```

3. **Use Environment Variables**:
   ```javascript
   const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
   ```

4. **Implement Retry Logic**:
   ```javascript
   const retryRequest = async (fn, retries = 3) => {
     try {
       return await fn();
     } catch (error) {
       if (retries > 0) {
         await new Promise(resolve => setTimeout(resolve, 1000));
         return retryRequest(fn, retries - 1);
       }
       throw error;
     }
   };
   ```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid API Key" Error
- **Cause**: Wrong API key or not properly set in environment variables
- **Solution**: 
  - Double-check your API key in TMDB settings
  - Ensure `.env` file is in the correct directory
  - Restart your development server after changing `.env`

#### 2. "Request Limit Exceeded" Error
- **Cause**: Too many requests in a short time
- **Solution**: 
  - Implement request throttling
  - Add delays between requests
  - Use caching to reduce API calls

#### 3. CORS Errors
- **Cause**: Browser blocking cross-origin requests
- **Solution**: 
  - Make API calls from your backend instead of frontend
  - Use a proxy server
  - TMDB allows CORS for localhost development

#### 4. Network Timeout
- **Cause**: Slow internet or TMDB server issues
- **Solution**: 
  - Increase timeout values
  - Implement retry logic
  - Use fallback data

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   # In your terminal
   echo $VITE_TMDB_API_KEY  # Frontend
   echo $TMDB_API_KEY       # Backend
   ```

2. **Test API Key Manually**:
   ```bash
   curl "https://api.themoviedb.org/3/configuration?api_key=YOUR_API_KEY"
   ```

3. **Check Network Tab**: Open browser DevTools → Network tab to see API requests

4. **Check Console Logs**: Look for error messages in browser console

## 📞 Support

If you encounter issues:

1. **TMDB Support**: [TMDB Support Forum](https://www.themoviedb.org/talk)
2. **API Documentation**: [TMDB API Docs](https://developers.themoviedb.org/3)
3. **Status Page**: [TMDB Status](https://status.themoviedb.org/)

## 🎉 Next Steps

Once your TMDB API is working:

1. Explore additional endpoints (TV shows, person details, etc.)
2. Implement advanced features (recommendations, similar movies)
3. Add image optimization for movie posters
4. Set up automated data synchronization
5. Consider upgrading to a paid TMDB plan for higher limits

---

**Happy coding! 🚀**

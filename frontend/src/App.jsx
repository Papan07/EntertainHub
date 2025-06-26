import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Movies from './components/Movies';
import Series from './components/Series';
import Trending from './components/Trending';
import Watchlist from './components/Watchlist';
import SearchResults from './components/SearchResults';
import MovieDetail from './components/MovieDetail';
import Profile from './components/Profile';
import ErrorBoundary from './components/ErrorBoundary';
import SearchTest from './components/SearchTest';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Styles
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: {
                    primary: '#4ecdc4',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff6b6b',
                    secondary: '#ffffff',
                  },
                },
              }}
            />

            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <div className="main-layout">
                  <Navbar />
                  <Homepage />
                </div>
              } />

              <Route path="/movies" element={
                <div className="main-layout">
                  <Navbar />
                  <Movies />
                </div>
              } />

              <Route path="/series" element={
                <div className="main-layout">
                  <Navbar />
                  <Series />
                </div>
              } />

              <Route path="/trending" element={
                <div className="main-layout">
                  <Navbar />
                  <Trending />
                </div>
              } />

              <Route path="/watchlist" element={
                <div className="main-layout">
                  <Navbar />
                  <Watchlist />
                </div>
              } />

              <Route path="/profile" element={<Profile />} />

              <Route path="/search" element={
                <div className="main-layout">
                  <Navbar />
                  <SearchResults />
                </div>
              } />

              <Route path="/movie/:source/:id" element={
                <div className="main-layout">
                  <Navbar />
                  <MovieDetail />
                </div>
              } />

              <Route path="/movie/:id" element={
                <div className="main-layout">
                  <Navbar />
                  <MovieDetail />
                </div>
              } />

              <Route path="/test-search" element={
                <div className="main-layout">
                  <Navbar />
                  <SearchTest />
                </div>
              } />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Ambient Background */}
            <div className="app-background">
              <div className="bg-orb orb-1"></div>
              <div className="bg-orb orb-2"></div>
              <div className="bg-orb orb-3"></div>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Oops! Something went wrong</h1>
            <p className="error-message">
              We're sorry, but something unexpected happened. Don't worry, it's not your fault!
            </p>
            
            <div className="error-actions">
              <button className="error-btn primary" onClick={this.handleRetry}>
                Try Again
              </button>
              <button className="error-btn secondary" onClick={this.handleReload}>
                Reload Page
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <div className="error-stack">
                  <h3>Error:</h3>
                  <pre>{this.state.error.toString()}</pre>
                  
                  <h3>Component Stack:</h3>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component version for specific error scenarios
export const ApiErrorFallback = ({ error, resetError, title = "Failed to load content" }) => (
  <div className="api-error-fallback">
    <div className="error-content">
      <div className="error-icon">🔌</div>
      <h2 className="error-title">{title}</h2>
      <p className="error-message">
        {error?.message || "There was a problem connecting to our servers. Please try again."}
      </p>
      
      <div className="error-actions">
        <button className="error-btn primary" onClick={resetError}>
          Try Again
        </button>
      </div>
    </div>
  </div>
);

// Network error component
export const NetworkError = ({ onRetry }) => (
  <div className="network-error">
    <div className="error-content">
      <div className="error-icon">📡</div>
      <h2 className="error-title">Connection Problem</h2>
      <p className="error-message">
        Please check your internet connection and try again.
      </p>
      
      <div className="error-actions">
        <button className="error-btn primary" onClick={onRetry}>
          Retry Connection
        </button>
      </div>
    </div>
  </div>
);

// Loading timeout error
export const LoadingTimeoutError = ({ onRetry, onCancel }) => (
  <div className="timeout-error">
    <div className="error-content">
      <div className="error-icon">⏱️</div>
      <h2 className="error-title">Taking longer than expected</h2>
      <p className="error-message">
        The content is taking a while to load. You can wait a bit more or try refreshing.
      </p>
      
      <div className="error-actions">
        <button className="error-btn primary" onClick={onRetry}>
          Try Again
        </button>
        <button className="error-btn secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default ErrorBoundary;

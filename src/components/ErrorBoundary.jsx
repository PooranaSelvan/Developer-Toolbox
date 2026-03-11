import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="rounded-2xl border border-error/20 bg-base-100 p-8 text-center shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-error" />
              </div>
              
              <h1 className="text-2xl font-extrabold mb-2">Oops! Something went wrong</h1>
              <p className="text-sm opacity-50 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-xs font-semibold text-error cursor-pointer mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="rounded-xl bg-base-200 p-3 text-xs font-mono overflow-auto max-h-40">
                    <p className="text-error font-semibold mb-2">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="opacity-60 whitespace-pre-wrap text-[10px]">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={this.handleReset}
                  className="btn btn-primary btn-sm rounded-xl gap-2"
                >
                  <RefreshCw size={14} />
                  Try Again
                </button>
                <Link to="/" className="btn btn-ghost btn-sm rounded-xl gap-2">
                  <Home size={14} />
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

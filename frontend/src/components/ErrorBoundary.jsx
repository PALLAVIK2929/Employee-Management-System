import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                <AlertTriangle size={48} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
              Something went wrong
            </h1>
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, your data is safe. 
              Try reloading the page to continue.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-left">
                <p className="text-xs font-mono text-red-800 dark:text-red-300 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            
            <button
              onClick={this.handleReload}
              className="px-8 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg transform hover:scale-105 active:scale-95"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

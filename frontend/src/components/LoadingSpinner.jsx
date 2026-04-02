import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[var(--border-color)] rounded-full" />
            <div className="absolute inset-0 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
            <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-4">Loading EMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-[var(--border-color)] rounded-full" />
          <div className="absolute inset-0 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-[var(--text-secondary)] font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  illustration = 'default'
}) => {
  const illustrations = {
    default: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="currentColor" opacity="0.1"/>
        <path d="M40 60h40M60 40v40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    employees: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="45" r="15" fill="currentColor" opacity="0.2"/>
        <path d="M35 85c0-13.8 11.2-25 25-25s25 11.2 25 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    leaves: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="30" width="60" height="60" rx="8" fill="currentColor" opacity="0.1"/>
        <path d="M45 30v-5M60 30v-5M75 30v-5M30 45h60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    notifications: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 30c-11 0-20 9-20 20v15l-5 10h50l-5-10V50c0-11-9-20-20-20z" fill="currentColor" opacity="0.1"/>
        <path d="M52 75c0 4.4 3.6 8 8 8s8-3.6 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    performance: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 35l5 15h16l-13 10 5 15-13-10-13 10 5-15-13-10h16z" fill="currentColor" opacity="0.1"/>
        <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="3" opacity="0.2"/>
      </svg>
    ),
    attendance: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="4" opacity="0.2"/>
        <path d="M60 35v25l15 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.3"/>
      </svg>
    )
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 text-[var(--text-secondary)] opacity-40">
        {illustrations[illustration] || illustrations.default}
      </div>
      
      {Icon && (
        <div className="mb-4 p-4 bg-[var(--input-bg)] rounded-full">
          <Icon size={32} className="text-[var(--text-secondary)]" />
        </div>
      )}
      
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      
      <p className="text-[var(--text-secondary)] mb-6 max-w-md leading-relaxed">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg transform hover:scale-105 active:scale-95"
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

import React from 'react';

/**
 * Reusable Avatar component with consistent styling across the app
 * Displays user initials in a rounded square with solid dark purple background
 * 
 * @param {string} initials - 1-2 character initials (e.g., "AC", "JD")
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} className - Additional CSS classes
 */
const Avatar = ({ initials = '??', size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: {
      container: 'w-8 h-8',
      borderRadius: 'rounded-lg', // 8px
      fontSize: 'text-xs', // 12px
    },
    md: {
      container: 'w-10 h-10',
      borderRadius: 'rounded-xl', // 12px
      fontSize: 'text-sm', // 13-14px
    },
    lg: {
      container: 'w-[72px] h-[72px]',
      borderRadius: 'rounded-2xl', // 16px
      fontSize: 'text-[22px]',
    },
  };

  const styles = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      className={`${styles.container} ${styles.borderRadius} bg-[#534AB7] flex items-center justify-center text-white font-bold ${styles.fontSize} flex-shrink-0 ${className}`}
      aria-label={`Avatar for ${initials}`}
    >
      {initials.toUpperCase().slice(0, 2)}
    </div>
  );
};

export default Avatar;

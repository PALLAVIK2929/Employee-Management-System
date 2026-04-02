import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ value = 0, onChange, readOnly = false, size = 20 }) => {
  const [hoverValue, setHoverValue] = React.useState(0);

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  const getStarFill = (index) => {
    const currentValue = hoverValue || value;
    if (currentValue >= index) {
      return 'full';
    } else if (currentValue >= index - 0.5) {
      return 'half';
    }
    return 'empty';
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => {
        const fill = getStarFill(index);
        return (
          <div
            key={index}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`relative ${!readOnly ? 'cursor-pointer' : ''}`}
            style={{ width: size, height: size }}
          >
            {fill === 'full' ? (
              <Star
                size={size}
                fill="#F59E0B"
                stroke="#F59E0B"
                className="transition-all duration-200"
              />
            ) : fill === 'half' ? (
              <div className="relative">
                <Star
                  size={size}
                  stroke="#D1D5DB"
                  fill="transparent"
                  className="absolute top-0 left-0"
                />
                <div style={{ width: '50%', overflow: 'hidden' }}>
                  <Star
                    size={size}
                    fill="#F59E0B"
                    stroke="#F59E0B"
                  />
                </div>
              </div>
            ) : (
              <Star
                size={size}
                stroke="#D1D5DB"
                fill="transparent"
                className="transition-all duration-200"
              />
            )}
          </div>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold text-[var(--text-primary)]">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;

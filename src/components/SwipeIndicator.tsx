import React from 'react';

const SwipeIndicator: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Call the onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  const handleTouch = (e: React.TouchEvent) => {
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Call the onClick handler if provided
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer"
      style={{ 
        padding: '12px 24px', 
        opacity: 0.85,
        touchAction: 'manipulation'
      }}
      onClick={handleClick}
      onTouchEnd={handleTouch}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <svg width="96" height="36" viewBox="0 0 96 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 6L48 30L72 6" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  );
};

export default SwipeIndicator; 
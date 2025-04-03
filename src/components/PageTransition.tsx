import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('');

  useEffect(() => {
    if (location !== displayLocation) {
      // Start exiting the current page
      setTransitionStage('page-exit');
      
      // Apply exit animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionStage('page-exit page-exit-active');
        });
      });

      // Switch to the new page content at the right moment
      // but keep it out of view until animation is ready
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('page-enter');
        
        // Start the enter animation immediately after
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitionStage('page-enter page-enter-active');
          });
        });
      }, 350); // Half the animation duration for smoother overlap

      // Clear all classes when done
      const transitionEnd = setTimeout(() => {
        setTransitionStage('');
      }, 800);

      return () => {
        clearTimeout(timeout);
        clearTimeout(transitionEnd);
      };
    }
  }, [location, displayLocation]);

  return (
    <div className={`page-transition-wrapper ${transitionStage}`}>
      {children}
    </div>
  );
};

export default PageTransition; 
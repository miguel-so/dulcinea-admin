// hooks/useParallax.ts
import { useEffect, useRef } from 'react';

export const useParallax = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5; // Adjust this value to control parallax speed
      
      // Apply the transform to create parallax effect
      element.style.backgroundPosition = `center ${rate}px`;
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { ref };
};
// hooks/useParallaxAnimation.ts
import { useEffect, useState } from 'react';

export const useParallaxAnimation = (
  elementRef: React.RefObject<HTMLElement>,
  speed: number = 0.5
) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      const { top } = elementRef.current.getBoundingClientRect();
      const scrollOffset = window.scrollY * speed;
      setOffset(scrollOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef, speed]);

  return offset;
};
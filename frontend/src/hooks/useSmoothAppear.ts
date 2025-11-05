import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useSmoothAppear = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return { ref, isInView, variants };
};
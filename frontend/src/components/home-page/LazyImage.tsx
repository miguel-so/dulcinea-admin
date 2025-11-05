// components/LazyImage.tsx
import { Box, Image, Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface LazyImageProps {
  src: string;
  alt: string;
  ratio?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  ratio = 1,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <MotionBox
      position="relative"
      paddingTop={`${ratio * 100}%`}
      overflow="hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <Skeleton
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        isLoaded={isLoaded && !error}
      >
        <Image
          src={src}
          alt={alt}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          objectFit="cover"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
        />
      </Skeleton>
    </MotionBox>
  );
};

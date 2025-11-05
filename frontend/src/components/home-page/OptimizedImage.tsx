// components/OptimizedImage.tsx
import { Box, Image, Skeleton } from "@chakra-ui/react";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  ratio?: number;
  [key: string]: any;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  ratio = 1,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box position="relative" paddingTop={`${ratio * 100}%`}>
      <Skeleton
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        isLoaded={!isLoading}
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
          onLoad={() => setIsLoading(false)}
          {...props}
        />
      </Skeleton>
    </Box>
  );
};

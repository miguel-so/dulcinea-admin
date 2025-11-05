// components/GallerySlide.tsx
import { Box, Heading, Text, IconButton, Flex } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { OptimizedImage } from './OptimizedImage';

interface GallerySlideProps {
  image: string;
  title: string;
  description: string;
}

export const GallerySlide: React.FC<GallerySlideProps> = ({
  image,
  title,
  description
}) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      height="100%"
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      <Box position="relative" paddingTop="100%">
        <OptimizedImage
          src={image}
          alt={title}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      
      <Flex p={6} justify="space-between" align="flex-start">
        <Box flex={1} pr={4}>
          <Heading
            as="h3"
            fontSize="xl"
            fontWeight="bold"
            mb={2}
            color="gray.800"
          >
            {title}
          </Heading>
          <Text
            fontSize="md"
            color="gray.600"
            noOfLines={3}
          >
            {description}
          </Text>
        </Box>
        <IconButton
          aria-label="View details"
          icon={<ChevronRightIcon boxSize={6} />}
          variant="ghost"
          color="primary.green"
          _hover={{ bg: 'green.50' }}
        />
      </Flex>
    </Box>
  );
};
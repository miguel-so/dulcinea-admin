// components/CategoryCard.tsx
import { Box, Image, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface CategoryCardProps {
  image: string;
  title: string;
  description: string;
  index?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  image,
  title,
  description,
  index = 0,
}) => {
  return (
    <MotionBox
      className="item features-image"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ y: -5 }}
    >
      <VStack
        className="item-wrapper"
        spacing={0}
        height="100%"
        align="stretch"
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
      >
        {/* Image Container */}
        <Box
          className="item-img"
          position="relative"
          pt="100%" // Force 1:1 aspect ratio
          overflow="hidden"
        >
          <Image
            src={image}
            alt={title}
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            objectFit="cover"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Box>

        {/* Content Container */}
        <VStack
          className="item-content"
          align="flex-start"
          p={6}
          spacing={3}
          flex={1}
        >
          <Heading
            as="h5"
            className="item-title mbr-fonts-style display-7"
            fontSize={{ base: "1.1rem", md: "1.2rem" }}
            fontWeight="bold"
            color="gray.800"
          >
            {title}
          </Heading>

          <Text
            className="mbr-text mbr-fonts-style display-4"
            color="gray.600"
            fontSize={{ base: "1rem", md: "1.1rem" }}
          >
            {description}
          </Text>
        </VStack>

        {/* Button Container */}
        <Box className="mbr-section-btn item-footer" p={6} pt={0} mt="auto">
          <Button
            as="a"
            href="/arts"
            className="btn item-btn btn-warning display-4"
            colorScheme="yellow"
            size="lg"
            width="100%"
            fontSize={{ base: "1rem", md: "1.1rem" }}
            py={6}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            target="_blank"
          >
            View Arts
          </Button>
        </Box>
      </VStack>
    </MotionBox>
  );
};

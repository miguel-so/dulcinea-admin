import React from 'react';
import { Box, Container, Stack, Heading, Text, Link } from '@chakra-ui/react';

const About: React.FC = () => {
  return (
    <Box
      as="section"
      position="relative"
      minH="calc(100vh - 72px)"
      py={{ base: 20, md: 32 }}
      bgImage="url('/about-bg.jpg')"
      bgPosition="top center"
      bgRepeat="repeat-y"
      bgSize="auto"
      display="flex"
      alignItems="center"
    >
      <Container maxW="4xl" position="relative" zIndex={1}>
        <Stack
          spacing={6}
          textAlign="center"
          bg="whiteAlpha.800"
          p={{ base: 6, md: 12 }}
          borderRadius="lg"
          boxShadow="lg"
        >
          <Heading as="h4" size="xl" fontWeight="bold" color="#1f6463">
            About Artist
          </Heading>
          <Heading as="h5" size="md" fontWeight="semibold" color="gray.600">
            MARCH 14, 2025
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="#1f6463">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac feugiat neque. Nulla
            gravida sodales enim at interdum. Pellentesque habitant morbi tristique senectus et netus
            et malesuada fames ac turpis egestas.
          </Text>
          <Box>
            <Text fontWeight="bold">Instagram Account</Text>
            <Link
              href="https://www.instagram.com/dulcineasart/"
              color="green.600"
              isExternal
            >
              https://www.instagram.com/dulcineasart/
            </Link>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default About;

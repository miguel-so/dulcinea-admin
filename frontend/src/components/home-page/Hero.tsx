// components/Hero.tsx
import { motion } from "framer-motion";
import {
  Box,
  Image,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Icon,
} from "@chakra-ui/react";

import { FaPaintBrush } from "react-icons/fa";

import { useParallax } from "../../hooks/useParallax";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

export const Hero = () => {
  const { ref: contentRef, controls: contentControls } = useScrollAnimation();
  const { ref: imageRef, controls: imageControls } = useScrollAnimation();
  const { ref: parallaxRef } = useParallax();

  return (
    <Box
      as="section"
      position="relative"
      className="header1"
      id="header01-13"
      ref={parallaxRef}
      sx={{
        backgroundImage: "url('/home-bg.jpg')", // Add your background image
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.8,
          backgroundColor: "rgb(241, 255, 233)",
          zIndex: 1,
        },
      }}
    >
      <Container
        maxW="container.fluid"
        position="relative"
        zIndex={2}
        py={{ base: "5rem", md: "6rem" }}
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: 8, md: 10 }}
          justify="center"
          align="center"
          flexDirection="row-reverse"
        >
          {/* Image Column */}
          <MotionBox
            ref={imageRef}
            animate={imageControls}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            w={{ base: "100%", md: "66.67%", lg: "50%" }}
            className="image-wrapper"
          >
            <Image
              src="/home-hero.png"
              alt="Hero"
              w="100%"
              h="auto"
              maxW="692px"
              mx="auto"
            />
          </MotionBox>

          {/* Content Column */}
          <MotionStack
            ref={contentRef}
            animate={contentControls}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            flex="1"
            spacing={4}
            align="flex-start"
            className="text-wrapper"
          >
            <Heading
              as="h1"
              fontSize={{ base: "2.5rem", md: "3rem" }}
              fontWeight="bold"
              className="mbr-section-title"
            >
              ✨ Dulcinea-Art
            </Heading>

            <Text
              fontSize={{ base: "1.2rem", md: "1.4rem" }}
              className="mbr-desc"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              eiusmod tempor incididunt labore dolore magna aliqua.
            </Text>

            <Text
              fontSize={{ base: "1.2rem", md: "1.4rem" }}
              className="mbr-text"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              eiusmod tempor incididunt labore dolore magna aliqua.
            </Text>

            <Box mt={4} className="mbr-section-btn">
              <Button
                as="a"
                href="/about.html"
                size="lg"
                colorScheme="green"
                leftIcon={<Icon as={FaPaintBrush} />}
                fontSize={{ base: "1.2rem", md: "1.4rem" }}
                px={6}
                py={6}
                h="auto"
                className="btn btn-success"
              >
                About Artist
              </Button>
            </Box>
          </MotionStack>
        </Stack>
      </Container>
    </Box>
  );
};

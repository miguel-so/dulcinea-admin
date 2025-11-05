// components/ArtistSpotlight.tsx
import { Box, Heading, Text, Image, Container } from "@chakra-ui/react";

import { useParallax } from "../../hooks/useParallax";

interface SpotlightCardProps {
  image: string;
  date: { day: string; month: string };
  type: string;
  title: string;
  isFirst?: boolean;
}

const spotlightItems = [
  {
    image: "/art1.png",
    date: { day: "27", month: "Dec" },
    type: "Design",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
  },
  {
    image: "/art2.png",
    date: { day: "29", month: "Dec" },
    type: "Art",
    title: "Praesent tortor arcu, rhoncus dignissim id ac sapien.",
  },
  {
    image: "/art3.png",
    date: { day: "30", month: "Dec" },
    type: "Branding",
    title: "Morbi suscipit velit elementum volutpat pharetra.",
  },
];

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  image,
  date,
  type,
  title,
  isFirst,
}) => {
  return (
    <Box
      className={`card ${
        isFirst ? "first" : ""
      } col-12 col-md-6 col-lg-3 md-pb`}
      borderRight={{ lg: "1px solid rgba(0, 0, 0)" }} // Darker border color
      _last={{ borderRight: "none" }}
      width={{ base: "100%", md: "50%", lg: "25%" }} // Match Bootstrap grid
      px={4} // Padding for the border spacing
    >
      <Box className="card-wrapper" height="100%">
        <Box className="card-box align-left" height="100%">
          <Box
            className="item-img"
            position="relative"
            width="454px" // Match original image width
            maxW="100%" // Ensure responsive behavior
            height="452px" // Match original image height
            mx="auto" // Center the image container
          >
            <Image
              src={image}
              alt={title}
              width="100%"
              height="100%"
              objectFit="cover"
            />
            <Box
              className="card-date mbr-fonts-style display-4"
              position="absolute"
              top={4}
              left={4}
              bg="white"
              px={4}
              py={2}
              borderRadius="md"
              textAlign="center"
              fontFamily="Inter Tight"
              fontSize="1rem"
              lineHeight="1.2"
              color="gray.700"
              fontWeight="normal"
            >
              {date.day}
              <br />
              {date.month}
            </Box>
            <Box
              className="card-type mbr-fonts-style display-4"
              position="absolute"
              top={4}
              right={4}
              bg="white"
              px={4}
              py={2}
              borderRadius="md"
              fontFamily="Inter Tight"
              fontSize="1rem"
              color="gray.700"
              fontWeight="normal"
            >
              {type}
            </Box>
          </Box>

          <Box mt={4}>
            <Heading
              as="h5"
              className="card-title mbr-fonts-style display-7"
              fontSize="1.1rem"
              fontWeight="normal"
              lineHeight="1.5"
              fontFamily="Inter Tight"
              color="gray.700"
            >
              {title}
            </Heading>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ArtistSpotlight = () => {
  const { ref: parallaxRef } = useParallax();

  return (
    <Box
      as="section"
      ref={parallaxRef}
      className="features6 cid-v0naGQnH76 mbr-parallax-background"
      position="relative"
      bg="rgb(239, 255, 228)"
      py={12}
      sx={{
        backgroundImage: "url('/home-bg.jpg')",
        backgroundAttachment: "fixed",
        backgroundPosition: "50% 50%",
        backgroundSize: "cover",
      }}
    >
      <Box
        className="mbr-overlay"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.7}
        bg="rgb(239, 255, 228)"
      />

      <Container maxW="container.fluid" position="relative" zIndex={1}>
        <Box className="row">
          {/* Title */}
          <Box w="100%" mb={6}>
            <Heading
              className="mbr-section-title mbr-fonts-style mb-3 display-5"
              fontSize="1.5rem"
              fontWeight="bold"
              fontFamily="Inter Tight"
              textAlign="left"
            >
              <strong>Artist Spotlight</strong>
            </Heading>
          </Box>

          {/* Content */}
          <Box
            display="flex"
            flexWrap="wrap"
            mx={-4} // Compensate for card padding
          >
            {/* View All Link */}
            <Box
              className="col-12 col-md-6 col-lg-3 md-pb"
              borderRight={{ lg: "1px solid" }}
              borderColor={{ lg: "black" }}
              width={{ base: "100%", md: "50%", lg: "25%" }}
              px={4}
            >
              <Box className="card-wrapper">
                <Box className="card-box align-left">
                  <Box className="link-wrapper">
                    <Text
                      className="link mbr-fonts-style display-4"
                      fontFamily="Inter Tight"
                      fontSize="1.1rem"
                      color="gray.700"
                      cursor="pointer"
                      _hover={{ color: "gray.900" }}
                    >
                      View All
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Cards */}
            {spotlightItems.map((item, index) => (
              <SpotlightCard key={index} {...item} isFirst={index === 0} />
            ))}
          </Box>

          {/* Bottom Line */}
          <Box
            className="line mt-4 pt-5"
            w="100%"
            h="1px"
            bg="black"
            mt={16}
            mb={4}
          />
        </Box>
      </Container>
    </Box>
  );
};

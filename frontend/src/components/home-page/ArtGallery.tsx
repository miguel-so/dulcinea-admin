// components/ArtGallery.tsx
import { Box, Container, Heading } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronRightIcon } from "@chakra-ui/icons";

import "swiper/css/bundle";

import "./swiper.css";

interface GalleryItem {
  image: string;
  title: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    image: "/art1.png",
    title: "Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt labore dolore magna aliqua.",
  },
  {
    image: "/art2.png",
    title: "Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt labore dolore magna aliqua.",
  },
  {
    image: "/art3.png",
    title: "Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt labore dolore magna aliqua. engagement.",
  },
  {
    image: "/art4.png",
    title: "Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt labore dolore magna aliqua. engagement.",
  },
  {
    image: "/art5.png",
    title: "Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt labore dolore magna aliqua. engagement.",
  },
];

export const ArtGallery = () => {
  return (
    <Box py={20}>
      <Container maxW="container.fluid">
        <Box textAlign="center" mb={10}>
          <Heading
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            mb={0}
          >
            Art Gallery ✨
          </Heading>
        </Box>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView="auto"
          centeredSlides={true}
          loop={true}
          autoplay={false}
          navigation
          pagination={{ clickable: true }}
          className="art-gallery-swiper"
        >
          {galleryItems.map((item, index) => (
            <SwiperSlide
              key={index}
              style={{ width: "auto", maxWidth: "500px" }}
            >
              <Box
                bg="white"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                mx={4}
              >
                <Box position="relative" pt="100%">
                  <Box
                    as="img"
                    src={item.image}
                    alt={item.title}
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                </Box>
                <Box p={6}>
                  <Box display="flex" justifyContent="space-between">
                    <Box flex={1} pr={4}>
                      <Heading as="h3" fontSize="xl" fontWeight="bold" mb={2}>
                        {item.title}
                      </Heading>
                      <Box fontSize="md" color="gray.600">
                        {item.description}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      cursor="pointer"
                      color="primary.green"
                    >
                      <ChevronRightIcon w={6} h={6} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
};

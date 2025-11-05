// components/SwiperNavButton.tsx
import { IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useSwiper } from "swiper/react";

interface SwiperNavButtonProps {
  direction: "prev" | "next";
}

export const SwiperNavButton: React.FC<SwiperNavButtonProps> = ({
  direction,
}) => {
  const swiper = useSwiper();

  return (
    <IconButton
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      icon={direction === "prev" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      {...(direction === "prev" ? { left: 4 } : { right: 4 })}
      zIndex={2}
      rounded="full"
      bg="white"
      shadow="lg"
      color="primary.green"
      _hover={{ bg: "white", transform: "translateY(-50%) scale(1.1)" }}
      onClick={() =>
        direction === "prev" ? swiper.slidePrev() : swiper.slideNext()
      }
    />
  );
};

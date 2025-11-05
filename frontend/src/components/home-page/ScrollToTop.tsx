// components/ScrollToTop.tsx
import { IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { motion, useScroll, useTransform } from "framer-motion";

const MotionIconButton = motion(IconButton);

export const ScrollToTop = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [0, 1]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MotionIconButton
      aria-label="Scroll to top"
      icon={<ArrowUpIcon />}
      position="fixed"
      bottom={4}
      right={4}
      rounded="full"
      bg="primary.green"
      color="white"
      size="lg"
      onClick={scrollToTop}
      style={{ opacity }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    />
  );
};

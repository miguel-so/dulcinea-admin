import { Box, BoxProps } from "@chakra-ui/react";
import { motion, useViewportScroll, useTransform } from "framer-motion";

const MotionBox = motion(Box);

interface ParallaxSectionProps extends BoxProps {
  overlayColor: string;
  overlayOpacity: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  overlayColor,
  overlayOpacity,
  children,
  ...props
}) => {
  const { scrollY } = useViewportScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <Box position="relative" className="mbr-parallax-background" {...props}>
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{ y }}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={overlayColor}
        opacity={overlayOpacity}
      />
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
};

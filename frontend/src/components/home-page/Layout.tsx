// components/Layout.tsx
import { Box, BoxProps } from "@chakra-ui/react";

interface LayoutProps extends BoxProps {
  fluid?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  fluid,
  children,
  ...props
}) => {
  return (
    <Box
      px={{ base: 4, md: 6, lg: 8 }}
      mx="auto"
      maxW={fluid ? "container.fluid" : "container.xl"}
      {...props}
    >
      {children}
    </Box>
  );
};

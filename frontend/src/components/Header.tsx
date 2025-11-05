import React from "react";
import {
  Box,
  Flex,
  Image,
  Link,
  Container,
  IconButton,
} from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Path } from "../lib/constants/path.constants";

const MotionBox = motion(Box);

// Only height animation for scroll
const navVariants: Variants = {
  default: {
    height: "80px",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  scrolled: {
    height: "60px",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const Links = [
  { name: "Home", path: Path.HOME, isStrong: true },
  { name: "About Us", path: Path.ABOUT, isStrong: true },
  { name: "Arts", path: Path.ARTS, isStrong: false },
];

const NavLink = ({
  children,
  path,
  isStrong,
}: {
  children: React.ReactNode;
  path: string;
  isStrong: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <Link
      className="nav-link link text-white text-primary display-4"
      onClick={() => navigate(path)}
      px={2}
      py={2}
      position="relative"
      fontFamily="Inter Tight"
      fontSize={{ base: "0.875rem", md: "1rem" }}
      color="white"
      textDecoration="none"
      transition="color 0.2s"
      _hover={{
        color: "rgba(255, 255, 255, 0.8)",
        textDecoration: "none",
      }}
    >
      {isStrong ? <strong>{children}</strong> : children}
    </Link>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MotionBox
      initial="default"
      animate={isScrolled ? "scrolled" : "default"}
      variants={navVariants}
      as="section"
      className="menu menu2 cid-v0b5ifPp6l"
      data-bs-version="5.1"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={999}
      bg="#1f6463"
      borderBottom="1px solid transparent"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
    >
      <Box
        as="nav"
        className="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg"
        minH="60px"
        transition="all 0.3s"
        bg="#1f6463"
      >
        <Container
          maxW="container.fluid"
          px={{ base: 4, md: 6, lg: 8 }}
          display="flex"
          margin="auto"
          flexWrap="nowrap"
        >
          <Flex align="center" justify="space-between" w="100%">
            {/* Logo */}
            <Box
              className="navbar-brand"
              display="flex"
              alignItems="center"
              minH={isScrolled ? "60px" : "80px"}
              transition="all 0.3s"
            >
              <Box className="navbar-logo">
                <Link href="/" display="block">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    h={isScrolled ? "2.5rem" : "3.125rem"}
                    objectFit="contain"
                    transition="height 0.3s"
                  />
                </Link>
              </Box>
            </Box>

            {/* Hamburger Button */}
            <IconButton
              className="navbar-toggler"
              aria-label="Toggle navigation"
              display={{ base: "flex", lg: "none" }}
              onClick={() => setIsOpen(!isOpen)}
              variant="unstyled"
              color="#ffeb69"
              icon={
                <Box
                  className="hamburger"
                  position="relative"
                  w="1.4rem"
                  h="1.4rem"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      as="span"
                      position="absolute"
                      left={0}
                      width="100%"
                      height="2px"
                      bg="currentColor"
                      transition="all 0.3s"
                      transform={
                        isOpen
                          ? i === 0
                            ? "rotate(45deg)"
                            : i === 1
                            ? "scaleX(0)"
                            : i === 2
                            ? "scaleX(0)"
                            : "rotate(-45deg)"
                          : `translateY(${i * 0.4}rem)`
                      }
                      transformOrigin={i === 0 ? "top" : "bottom"}
                    />
                  ))}
                </Box>
              }
            />

            {/* Navigation Links */}
            <Box
              className="navbar-collapse"
              display={{ base: isOpen ? "block" : "none", lg: "block" }}
            >
              <Flex
                className="navbar-nav nav-dropdown nav-right"
                align="center"
                justify="flex-end"
                direction={{ base: "column", lg: "row" }}
                w="100%"
                pt={{ base: 4, lg: 0 }}
              >
                {Links.map((link, i) => (
                  <Box
                    key={link.name}
                    className="nav-item"
                    margin="0.667em 1em"
                  >
                    <NavLink path={link.path} isStrong={link.isStrong}>
                      {link.name}
                    </NavLink>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Container>
      </Box>
    </MotionBox>
  );
};

export default Header;

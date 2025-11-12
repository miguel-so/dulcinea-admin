import React, { useState } from "react";
import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";

interface ThumbnailPreviewProps {
  imageUrl: string;
}

const IMAGE_BASE_URL =
  process.env.REACT_APP_MODE === "development"
    ? process.env.REACT_APP_API_URL
    : `${process.env.REACT_APP_API_URL}/backend/src/public`;

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ imageUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });

  return (
    <>
      <Box
        as="button"
        onClick={() => setIsModalOpen(true)}
        cursor="pointer"
        borderRadius="md"
        overflow="hidden"
        boxShadow="sm"
        transition="transform 0.2s"
        _hover={{ transform: "scale(1.05)" }}
        _focus={{ outline: "none", boxShadow: "outline" }}
      >
        <Image
          src={`${IMAGE_BASE_URL}/artworks/${imageUrl}`}
          alt="Thumbnail"
          boxSize="50px"
          objectFit="cover"
        />
      </Box>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={modalSize}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.900"
          color="white"
          maxW="90%"
          maxH="90vh"
          height="90vh"
          borderRadius="lg"
          overflow="hidden"
        >
          <ModalCloseButton
            color="white"
            size="lg"
            _hover={{ color: "gray.300" }}
          />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={0}
            height="100%"
          >
            <Image
              src={`${IMAGE_BASE_URL}/artworks/${imageUrl}`}
              alt="Full-size preview"
              maxHeight="90vh"
              maxWidth="100%"
              objectFit="contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ThumbnailPreview;

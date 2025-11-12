import React, { useEffect, useMemo } from "react";
import {
  Box,
  HStack,
  Icon,
  Image,
  CloseButton,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { MdCloudUpload } from "react-icons/md";

interface DulcineaImageGalleryDragDropProps {
  images: File[];
  onChange: (files: File[]) => void;
  defaultImageUrls?: string[];
  onDefaultImagesChange?: (urls: string[]) => void;
  maxFiles?: number;
}

const IMAGE_BASE_URL =
  process.env.REACT_APP_MODE === "development"
    ? process.env.REACT_APP_API_URL
    : `${process.env.REACT_APP_API_URL}/backend/src/public`;

const DulcineaImageGalleryDragDrop: React.FC<
  DulcineaImageGalleryDragDropProps
> = ({
  images,
  onChange,
  defaultImageUrls = [],
  onDefaultImagesChange,
  maxFiles = 4,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const existingCount = defaultImageUrls.length;
      const availableSlots = maxFiles - (existingCount + images.length);

      if (availableSlots <= 0) {
        return;
      }

      const filesToAdd = acceptedFiles.slice(0, availableSlots);
      if (filesToAdd.length === 0) {
        return;
      }

      const newFiles = [...images, ...filesToAdd];
      onChange(newFiles);
    },
    multiple: true,
  });

  const existingPreviews = useMemo(
    () =>
      defaultImageUrls.map((filename, index) => ({
        key: `existing-${index}-${filename}`,
        url: `${IMAGE_BASE_URL}/artworks/${filename}`,
        type: "existing" as const,
        filename,
        index,
      })),
    [defaultImageUrls]
  );

  const filePreviews = useMemo(
    () =>
      images.map((file, index) => ({
        key: `uploaded-${index}-${file.name}`,
        url: URL.createObjectURL(file),
        type: "new" as const,
        index,
      })),
    [images]
  );

  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [filePreviews]);

  const previews = [...existingPreviews, ...filePreviews];

  const removeImage = (preview: (typeof previews)[number]) => {
    if (preview.type === "existing") {
      if (!onDefaultImagesChange) {
        return;
      }

      const updatedDefaults = defaultImageUrls.filter(
        (_, idx) => idx !== preview.index
      );
      onDefaultImagesChange(updatedDefaults);
      return;
    }

    const updatedFiles = images.filter((_, idx) => idx !== preview.index);
    onChange(updatedFiles);
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        p={2}
        mb={4}
        border="2px dashed"
        borderRadius="md"
        borderColor={isDragActive ? "teal.400" : "gray.300"}
        bg={isDragActive ? "teal.50" : "gray.50"}
        textAlign="center"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ borderColor: "teal.400", bg: "teal.50" }}
      >
        <input {...getInputProps()} />
        <HStack spacing={2} justifyContent="center">
          <Icon as={MdCloudUpload} boxSize={10} color="teal.400" />
          <Text fontSize="sm" color="gray.500">
            Up to {maxFiles} images
          </Text>
        </HStack>
      </Box>

      {previews.length > 0 && (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
          {previews.map((preview) => (
            <Box
              key={preview.key}
              position="relative"
              borderRadius="md"
              overflow="hidden"
            >
              <Image
                src={preview.url}
                alt="Artwork"
                boxSize="150px"
                objectFit="cover"
                borderRadius="md"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.05)" }}
              />
              <CloseButton
                position="absolute"
                top="2"
                right="2"
                size="sm"
                onClick={() => removeImage(preview)}
                isDisabled={
                  preview.type === "existing" && !onDefaultImagesChange
                }
                zIndex={10}
                colorScheme="red"
              />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default DulcineaImageGalleryDragDrop;

import React, { useEffect } from 'react';
import { Box, HStack, Icon, Image, CloseButton, SimpleGrid, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { MdCloudUpload } from 'react-icons/md';

interface DulcineaImageGalleryDragDropProps {
  images: File[];
  onChange: (files: File[]) => void;
  defaultImageUrls?: string[];
  maxFiles?: number;
}

const DulcineaImageGalleryDragDrop: React.FC<DulcineaImageGalleryDragDropProps> = ({
  images,
  onChange,
  defaultImageUrls = [],
  maxFiles = 4,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      const newFiles = [...images, ...acceptedFiles].slice(0, maxFiles);
      onChange(newFiles);
    },
    multiple: true,
  });

  const removeImage = (index: number) => {
    const newFiles = [...images];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  // Create preview URLs for default images + uploaded files
  const previews = [
    ...defaultImageUrls.map((url) => ({ url: `${process.env.REACT_APP_API_URL}/artworks/${url}`, isFile: false })),
    ...images.map((file) => ({ url: URL.createObjectURL(file), isFile: true })),
  ];

  return (
    <Box>
      <Box
        {...getRootProps()}
        p={2}
        mb={4}
        border="2px dashed"
        borderRadius="md"
        borderColor={isDragActive ? 'teal.400' : 'gray.300'}
        bg={isDragActive ? 'teal.50' : 'gray.50'}
        textAlign="center"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ borderColor: 'teal.400', bg: 'teal.50' }}
      >
        <input {...getInputProps()} />
        <HStack spacing={2} justifyContent='center'>
          <Icon as={MdCloudUpload} boxSize={10} color="teal.400" />
          <Text fontSize="sm" color="gray.500">
            Up to {maxFiles} images
          </Text>
        </HStack>
      </Box>

      {previews.length > 0 && (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
          {previews.map((preview, idx) => (
            <Box key={idx} position="relative" borderRadius="md" overflow="hidden">
              <Image
                src={preview.url}
                alt="Artwork"
                boxSize="150px"
                objectFit="cover"
                borderRadius="md"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.05)' }}
              />
              <CloseButton
                position="absolute"
                top="2"
                right="2"
                size="sm"
                onClick={() => removeImage(idx - defaultImageUrls.length)}
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

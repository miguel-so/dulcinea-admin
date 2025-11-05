import React from 'react';
import { Textarea, TextareaProps } from '@chakra-ui/react';

interface DulcineaTextareaProps extends TextareaProps {}

const DulcineaTextarea: React.FC<DulcineaTextareaProps> = (props) => {
  return (
    <Textarea
      focusBorderColor="teal.400"
      borderRadius="md"
      bg="white"
      _placeholder={{ color: 'gray.500' }}
      _hover={{ bg: 'gray.50' }}
      {...props}
    />
  );
};

export default DulcineaTextarea;

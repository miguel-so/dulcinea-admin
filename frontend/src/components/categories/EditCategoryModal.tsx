import { useEffect, useState } from 'react';
import { FormControl, FormLabel, VStack } from '@chakra-ui/react';

import DulcineaModal from '../common/DulcineaModal';
import DulcineaInput from '../common/DulcineaInput';
import DulcineaTextarea from '../common/DulcineaTextarea';

interface EditCategoryModalProps {
  selectedCategory?: Category;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

const EditCategoryModal = ({
  selectedCategory,
  isOpen,
  onClose,
  onSubmit,
}: EditCategoryModalProps) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    setName(selectedCategory?.name || '');
    setDescription(selectedCategory?.description || '');
  }, [selectedCategory, isOpen]);

  return (
    <DulcineaModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSubmit(name, description)}
      title={selectedCategory ? 'Edit Category' : 'Create Category'}
      isSubmitDisabled={!name || !description}
      body={
        <VStack spacing={4} align='stretch'>
          <FormControl>
            <FormLabel color='gray.600'>Category Name</FormLabel>
            <DulcineaInput
              placeholder='Enter category name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel color='gray.600'>Description</FormLabel>
            <DulcineaTextarea
              placeholder='Enter description'
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </VStack>
      }
    />
  );
};

export default EditCategoryModal;

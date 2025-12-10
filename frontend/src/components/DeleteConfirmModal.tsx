import { VStack, Text } from "@chakra-ui/react";

import DulcineaModal from "./common/DulcineaModal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onSubmit,
}: DeleteConfirmModalProps) => {
  return (
    <DulcineaModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Delete Confirmation?"
      body={
        <VStack spacing={4} py={2}>
          <Text textAlign="center">
            The Delete action cannot be undone. All associated data will be
            permanently deleted. Are you sure about this Action?
          </Text>
        </VStack>
      }
    />
  );
};

export default DeleteConfirmModal;

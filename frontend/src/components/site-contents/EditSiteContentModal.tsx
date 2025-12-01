import { useEffect, useState } from "react";
import { FormControl, FormLabel, VStack } from "@chakra-ui/react";

import DulcineaModal from "../common/DulcineaModal";
import DulcineaInput from "../common/DulcineaInput";
import DulcineaTextarea from "../common/DulcineaTextarea";

interface EditSiteContentModalProps {
  selectedSiteContent?: SiteContent;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: string, value: string) => void;
}

const EditSiteContentModal = ({
  selectedSiteContent,
  isOpen,
  onClose,
  onSubmit,
}: EditSiteContentModalProps) => {
  const [item, setItem] = useState<string>("");
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setItem(selectedSiteContent?.item || "");
    setValue(selectedSiteContent?.value || "");
  }, [selectedSiteContent, isOpen]);

  return (
    <DulcineaModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSubmit(item, value)}
      title={selectedSiteContent ? "Edit Site Content" : "Create Site Content"}
      isSubmitDisabled={!item || !value}
      body={
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel color="gray.600">Site Content Item</FormLabel>
            <DulcineaInput
              placeholder="Enter site content item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.600">Value</FormLabel>
            <DulcineaTextarea
              placeholder="Enter value"
              rows={5}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </FormControl>
        </VStack>
      }
    />
  );
};

export default EditSiteContentModal;

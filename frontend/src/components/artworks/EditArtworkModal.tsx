import { useEffect, useState } from "react";
import { FormControl, FormLabel, VStack, SimpleGrid } from "@chakra-ui/react";

import DulcineaModal from "../common/DulcineaModal";
import DulcineaInput from "../common/DulcineaInput";
import DulcineaTextarea from "../common/DulcineaTextarea";
import DulcineaImageDragDrop from "../common/DulcineaImageDragDrop";
import { ArtworkStatus } from "../../lib/constants/artwork.constants";
import DulcineaSelect from "../common/DulcineaSelect";
import { ActionMeta, SingleValue } from "react-select";
import urlConstants from "../../lib/constants/url.constants";
import useApi from "../../lib/hooks/useApi";
import { ApiCommand } from "../../lib/Api";
import useToastNotification from "../../lib/hooks/useToastNotification";
import { categoriesToSelectOptionsMapper } from "../../lib/utils";
import DulcineaImageGalleryDragDrop from "../common/DulcineaImageGalleryDragDrop";

const { getCategories: getCategoriesUrl } = urlConstants.categories;

const statusOptions: SelectOption[] = Object.values(ArtworkStatus).map(
  (status) => ({
    label: status,
    value: status,
  })
);

interface EditArtworkModalProps {
  selectedArtwork?: Artwork;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    categoryId: string,
    size: string,
    media: string,
    printNumber: string,
    inventoryNumber: string,
    status: ArtworkStatus,
    price: string,
    location: string,
    notes: string,
    thumbnail: File | null,
    images: File[],
    existingThumbnail: string | null,
    existingImages: string[],
    removeExistingThumbnail: boolean
  ) => void;
}

const EditArtworkModal = ({
  selectedArtwork,
  isOpen,
  onClose,
  onSubmit,
}: EditArtworkModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [media, setMedia] = useState<string>("");
  const [printNumber, setPrintNumber] = useState<string>("");
  const [inventoryNumber, setInventoryNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [status, setStatus] = useState<ArtworkStatus>(ArtworkStatus.AVAILABLE);
  const [price, setPrice] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]); // new files
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null
  );
  const [thumbnail, setThumbnail] = useState<File | null>(null); // new thumbnail file
  const [removeExistingThumbnail, setRemoveExistingThumbnail] = useState<boolean>(false);

  const { sendRequest: getCategories } = useApi<GetCategoriesResopnse>();
  const showToast = useToastNotification();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setTitle(selectedArtwork?.title || "");
    setCategory(selectedArtwork?.categoryId || "");
    setSize(selectedArtwork?.size || "");
    setMedia(selectedArtwork?.media || "");
    setPrintNumber(selectedArtwork?.printNumber || "");
    setInventoryNumber(selectedArtwork?.inventoryNumber || "");
    setStatus(
      (selectedArtwork?.status as ArtworkStatus) || ArtworkStatus.AVAILABLE
    );
    setPrice(selectedArtwork?.price || "");
    setLocation(selectedArtwork?.location || "");
    setNotes(selectedArtwork?.notes || "");
    setExistingImages([...(selectedArtwork?.images || [])]);
    setExistingThumbnail(selectedArtwork?.thumbnail || null);
    setImages([]);
    setThumbnail(null);
    setRemoveExistingThumbnail(false);
  }, [selectedArtwork, isOpen]);
  const handleThumbnailSelect = (file: File | null) => {
    setThumbnail(file);

    if (file) {
      setRemoveExistingThumbnail(false);
    }
  };

  const handleDefaultThumbnailRemove = () => {
    setExistingThumbnail(null);
    setRemoveExistingThumbnail(true);
  };


  const fetchCategories = () => {
    getCategories({
      callback: (data: GetCategoriesResopnse | null, error: string | null) => {
        if (error) {
          showToast({
            title: "Failed",
            description: "Categories fetch failed",
            status: "error",
          });
          return;
        }
        if (!data) return null;
        setCategories(data.categories);
      },
      url: getCategoriesUrl,
      command: ApiCommand.GET,
      options: {
        all: "true",
      },
    });
  };

  const onChangeCategory = (
    newValue: SingleValue<SelectOption>,
    _actionMeta: ActionMeta<SelectOption>
  ) => {
    setCategory(newValue?.value || "");
  };

  return (
    <DulcineaModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() =>
        onSubmit(
          title,
          category,
          size,
          media,
          printNumber,
          inventoryNumber,
          status,
          price,
          location,
          notes,
          thumbnail,
          images,
          existingThumbnail,
          existingImages,
          removeExistingThumbnail
        )
      }
      title={selectedArtwork ? "Edit Artwork" : "Create Artwork"}
      isSubmitDisabled={!title}
      size="3xl"
      body={
        <VStack spacing={6} align="stretch">
          {/* --- Responsive Grid Layout --- */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <FormControl>
              <FormLabel color="gray.600">Title</FormLabel>
              <DulcineaInput
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">Category</FormLabel>
              <DulcineaSelect
                defaultValue={{
                  value: category,
                  label: categories.find((c) => c.id == category)?.name || "",
                }}
                options={categoriesToSelectOptionsMapper(categories)}
                onChange={onChangeCategory}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">Size</FormLabel>
              <DulcineaInput
                placeholder="Enter size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">Media</FormLabel>
              <DulcineaInput
                placeholder="Enter media"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">Print Number</FormLabel>
              <DulcineaInput
                placeholder="Enter print number"
                value={printNumber}
                onChange={(e) => setPrintNumber(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">Inventory Number</FormLabel>
              <DulcineaInput
                placeholder="Enter inventory number"
                value={inventoryNumber}
                type="number"
                onChange={(e) => setInventoryNumber(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">Status</FormLabel>
              <DulcineaSelect
                placeholder="Select status"
                options={statusOptions}
                defaultValue={{
                  label: status,
                  value: status,
                }}
                onChange={(newValue) => {
                  setStatus(newValue?.value as ArtworkStatus);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel color="gray.600">Price</FormLabel>
              <DulcineaInput
                placeholder="Enter price"
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel color="gray.600">Location</FormLabel>
              <DulcineaInput
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>
            {/* --- Notes Section --- */}
            <FormControl>
              <FormLabel color="gray.600">Reflective Notes</FormLabel>
              <DulcineaTextarea
                placeholder="Enter notes"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={4}>
            {/* --- Image Upload --- */}
            <FormControl>
              <FormLabel color="gray.600">Image</FormLabel>
              <DulcineaImageDragDrop
                onFileSelect={handleThumbnailSelect}
                defaultImageUrl={existingThumbnail || undefined}
                onDefaultRemove={handleDefaultThumbnailRemove}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.600">Artwork Images</FormLabel>
              <DulcineaImageGalleryDragDrop
                images={images}
                onChange={setImages}
                defaultImageUrls={existingImages}
                onDefaultImagesChange={setExistingImages}
                maxFiles={4}
              />
            </FormControl>
          </SimpleGrid>
        </VStack>
      }
    />
  );
};

export default EditArtworkModal;

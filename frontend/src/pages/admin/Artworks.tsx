import { useState, useEffect } from "react";
import { Box, Flex, IconButton, Button, Switch } from "@chakra-ui/react";
import { MdDelete, MdSearch, MdEdit } from "react-icons/md";

import Page from "../../components/common/Page";
import { ApiCommand } from "../../lib/Api";
import useToastNotification from "../../lib/hooks/useToastNotification";
import DulcineaTable from "../../components/common/DulcineaTable";
import DulcineaPagination from "../../components/common/DulcineaPagination";
import useApi from "../../lib/hooks/useApi";
import urlConstants from "../../lib/constants/url.constants";
import DulcineaInput from "../../components/common/DulcineaInput";
import ThumbnailPreview from "../../components/common/ThumbnailPreview";
import EditArtworkModal from "../../components/artworks/EditArtworkModal";
import { ArtworkStatus } from "../../lib/constants/artwork.constants";

const {
  createArtwork: createArtworkUrl,
  getArtworks: getArtworksUrl,
  editArtwork: editArtworkUrl,
  deleteArtwork: deleteArtworkUrl,
} = urlConstants.artworks;

const Artworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork>();

  const showToast = useToastNotification();

  const { loading: isGetArtworksLoading, sendRequest: getArtworks } =
    useApi<GetArtworksResopnse>();
  const { sendRequest: createArtwork } = useApi<any>();
  const { sendRequest: editArtwork } = useApi<any>();
  const { sendRequest: deleteArtwork } = useApi<any>();

  const ARTWORK_COLUMNS = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (value: string) => <ThumbnailPreview imageUrl={value} />,
    },
    {
      key: "size",
      label: "Size",
    },
    {
      key: "media",
      label: "Media",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "notes",
      label: "Notes",
    },
    {
      key: "isSpotlight",
      label: "Spotlight",
      render: (value: any, row: any) => {
        return (
          <Switch
            colorScheme="teal"
            isChecked={value == 1}
            onChange={() => toogleArtworkSpotlight(row)}
          />
        );
      },
    },
  ];

  const toogleArtworkSpotlight = (row: any) => {
    const newValue = row.isSpotlight === "0" ? 1 : 0; // toggle

    editArtwork({
      callback: (_data, error: string | null) => {
        if (error) {
          showToast({
            title: "Failed",
            description: error,
            status: "error",
          });
          return;
        }

        showToast({
          title: "Success",
          description: "Spotlight updated",
          status: "success",
        });

        fetchArtworks(); // refresh list
      },
      command: ApiCommand.PUT,
      url: editArtworkUrl(row.id),
      options: {
        isSpotlight: newValue,
      },
    });
  };

  const fetchArtworks = () => {
    getArtworks({
      callback: (data: GetArtworksResopnse | null, error: string | null) => {
        if (error) {
          showToast({
            title: "Failed",
            description: error,
            status: "error",
          });
          return;
        }
        if (!data) return null;
        setArtworks(data.artworks);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      },
      command: ApiCommand.GET,
      url: getArtworksUrl,
      options: {
        page: currentPage,
        limit: pageSize,
      },
    });
  };

  useEffect(() => {
    fetchArtworks();
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const onSaveArtwork = (
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
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", categoryId);
    formData.append("size", size);
    formData.append("media", media);
    formData.append("printNumber", printNumber);
    formData.append("inventoryNumber", inventoryNumber);
    formData.append("status", status);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("notes", notes);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (selectedArtwork) {
      formData.append("existingImages", JSON.stringify(existingImages));
      formData.append(
        "removeExistingThumbnail",
        removeExistingThumbnail ? "true" : "false"
      );

      if (existingThumbnail) {
        formData.append("existingThumbnail", existingThumbnail);
      }

      formData.append("artworkId", selectedArtwork?.id || "");
      editArtwork({
        callback: (_data, error: string | null) => {
          if (error) {
            showToast({
              title: "Failed",
              description: error,
              status: "error",
            });
            return;
          }
          showToast({
            title: "Success",
            description: "Artwork updated successfully",
            status: "success",
          });
          setIsOpenModal(false);
          fetchArtworks();
        },
        command: ApiCommand.PUT,
        url: editArtworkUrl(selectedArtwork?.id || ""),
        options: formData,
      });
    } else {
      createArtwork({
        callback: (_data, error: string | null) => {
          if (error) {
            showToast({
              title: "Failed",
              description: error,
              status: "error",
            });
            return;
          }
          showToast({
            title: "Success",
            description: "Artwork created successfully",
            status: "success",
          });
          setIsOpenModal(false);
          fetchArtworks();
        },
        command: ApiCommand.POST,
        url: createArtworkUrl,
        options: formData,
      });
    }
  };

  const onDeleteArtwork = (artworkId: string) => {
    deleteArtwork({
      callback: (_data, error: string | null) => {
        if (error) {
          showToast({
            title: "Failed",
            description: error,
            status: "error",
          });
          return;
        }
        showToast({
          title: "Success",
          description: "Artwork deleted successfully",
          status: "success",
        });
        fetchArtworks();
      },
      command: ApiCommand.DELETE,
      url: deleteArtworkUrl(artworkId),
    });
  };

  const onEditArtwork = (artworkId: string) => {
    setSelectedArtwork(artworks.find(({ id }) => id === artworkId));
    setIsOpenModal(true);
  };

  return (
    <Page>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        gap={4}
        flexWrap="wrap"
      >
        <Box flex="1" maxW="400px">
          {/* <DulcineaInput
            placeholder='Search'
            rightIcon={<MdSearch color='gray.500' />}
          /> */}
        </Box>
        <Button
          colorScheme="teal"
          px={6}
          py={4}
          borderRadius="md"
          fontWeight="bold"
          _hover={{ bg: "teal.300" }}
          onClick={() => {
            setSelectedArtwork(undefined);
            setIsOpenModal(true);
          }}
        >
          Create Artwork
        </Button>
      </Flex>

      <Flex flexDirection="column" height="full" justifyContent="space-between">
        <Box
          backgroundColor="white"
          borderRadius="lg"
          height="calc(100vh - 275px)"
        >
          <DulcineaTable
            columns={ARTWORK_COLUMNS}
            data={artworks}
            loading={isGetArtworksLoading}
            actions={(row) => (
              <>
                <IconButton
                  aria-label="Edit Artwork"
                  icon={<MdEdit />}
                  variant="outline"
                  colorScheme="teal"
                  size="sm"
                  marginRight={4}
                  onClick={() => onEditArtwork(row.id)}
                />
                <IconButton
                  aria-label="Delete Artwork"
                  icon={<MdDelete />}
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={() => onDeleteArtwork(row.id)}
                />
              </>
            )}
          />
        </Box>

        <DulcineaPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </Flex>

      <EditArtworkModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onSubmit={onSaveArtwork}
        selectedArtwork={selectedArtwork}
      />
    </Page>
  );
};

export default Artworks;

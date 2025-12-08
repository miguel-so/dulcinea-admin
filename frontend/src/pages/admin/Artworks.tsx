import { useState, useEffect } from "react";
import { Box, Flex, IconButton, Button, Switch } from "@chakra-ui/react";
import { MdDelete, MdSearch, MdEdit } from "react-icons/md";
import { ActionMeta, SingleValue } from "react-select";

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
import { useAuth } from "../../lib/contexts/AuthContext";
import DulcineaSelect from "../../components/common/DulcineaSelect";
import { categoriesToSelectOptionsMapper } from "../../lib/utils";

const {
  createArtwork: createArtworkUrl,
  getArtworks: getArtworksUrl,
  editArtwork: editArtworkUrl,
  deleteArtwork: deleteArtworkUrl,
} = urlConstants.artworks;

const { getCategories: getCategoriesUrl } = urlConstants.categories;

const statusOptions: SelectOption[] = Object.values(ArtworkStatus).map(
  (status) => ({
    label: status,
    value: status,
  })
);

const spotlightOptions: SelectOption[] = [
  { label: "Spotlight", value: "1" },
  { label: "Not Spotlight", value: "0" },
];

const Artworks = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork>();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<ArtworkStatus | null>(null);
  const [searchSpotlight, setSearchSpotlight] = useState<"1" | "0" | null>(
    null
  );

  const { user } = useAuth();

  const showToast = useToastNotification();

  const { loading: isGetArtworksLoading, sendRequest: getArtworks } =
    useApi<GetArtworksResopnse>();
  const { sendRequest: createArtwork } = useApi<any>();
  const { sendRequest: editArtwork } = useApi<any>();
  const { sendRequest: deleteArtwork } = useApi<any>();

  const { loading: isGetCategoriesLoading, sendRequest: getCategories } =
    useApi<GetCategoriesResopnse>();

  const selectedCategoryOption = searchCategory
    ? categories.find((c) => c.id == searchCategory)
      ? {
          label: categories.find((c) => c.id == searchCategory)?.name || "",
          value: searchCategory,
        }
      : null
    : null;

  const selectedStatusOption = searchStatus
    ? { label: searchStatus, value: searchStatus }
    : null;

  const selectedSpotlightOption = searchSpotlight
    ? {
        label: searchSpotlight == "1" ? "Spotlight" : "Not Spotlight",
        value: searchSpotlight,
      }
    : null;

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
      key: "categoryId",
      label: "Category",
      render: (value: string) =>
        categories.find((cat) => cat.id == value)?.name,
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "notes",
      label: "Notes",
      render: (value: string) =>
        value && value.length > 50 ? value.slice(0, 50) + "..." : value,
    },

    {
      key: "isSpotlight",
      label: "Spotlight",
      render: (value: any, row: any) => {
        const userRole = user?.role; // or however you store role
        const isSuperAdmin = userRole === "super_admin";

        return (
          <Switch
            colorScheme="teal"
            isChecked={value == 1}
            isDisabled={!isSuperAdmin} // 🔥 disable switch for non-super-admin
            onChange={() => {
              if (isSuperAdmin) {
                // 🔥 prevent execution
                toogleArtworkSpotlight(row);
              }
            }}
          />
        );
      },
    },
  ];

  const fetchCategories = () => {
    getCategories({
      callback: (data: GetCategoriesResopnse | null, error: string | null) => {
        if (error) {
          showToast({
            title: "Failed",
            description: error,
            status: "error",
          });
          return;
        }
        if (!data) return null;
        setCategories(data.categories);
      },
      command: ApiCommand.GET,
      url: getCategoriesUrl,
      options: {
        page: currentPage,
        limit: pageSize,
      },
    });
  };

  const toogleArtworkSpotlight = (row: any) => {
    const newValue = row.isSpotlight == 0 ? 1 : 0; // toggle

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

        fetchArtworks(
          searchKeyword,
          searchStatus,
          searchSpotlight,
          searchCategory
        ); // refresh list
      },
      command: ApiCommand.PUT,
      url: editArtworkUrl(row.id),
      options: {
        isSpotlight: newValue,
      },
    });
  };

  const fetchArtworks = (
    searchValue = "",
    searchStatus: ArtworkStatus | null = null,
    searchSpotlight: "1" | "0" | null = null,
    searchCategory: string | null = null
  ) => {
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
        category: searchCategory ? searchCategory : "",
        searchKeyword: searchValue,
        searchStatus,
        isSpotlight:
          searchSpotlight == "1"
            ? "true"
            : searchSpotlight == "0"
            ? "false"
            : null,
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isGetCategoriesLoading) {
      fetchArtworks(
        searchKeyword,
        searchStatus,
        searchSpotlight,
        searchCategory
      );
    }
  }, [currentPage, pageSize, isGetCategoriesLoading]);

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
          fetchArtworks(
            searchKeyword,
            searchStatus,
            searchSpotlight,
            searchCategory
          );
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
          fetchArtworks(
            searchKeyword,
            searchStatus,
            searchSpotlight,
            searchCategory
          );
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
        fetchArtworks(
          searchKeyword,
          searchStatus,
          searchSpotlight,
          searchCategory
        );
      },
      command: ApiCommand.DELETE,
      url: deleteArtworkUrl(artworkId),
    });
  };

  const onEditArtwork = (artworkId: string) => {
    setSelectedArtwork(artworks.find(({ id }) => id === artworkId));
    setIsOpenModal(true);
  };

  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchArtworks(value, searchStatus, searchSpotlight, searchCategory);
  };

  const onChangeCategory = (
    newValue: SingleValue<SelectOption>,
    _actionMeta: ActionMeta<SelectOption>
  ) => {
    setSearchCategory(newValue?.value || "");
    fetchArtworks(
      searchKeyword,
      searchStatus,
      searchSpotlight,
      newValue?.value
    );
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
        <Flex
          flex="1"
          maxWidth="900px"
          justifyContent="space-between"
          alignItems="center"
          gap="40px"
        >
          <Flex flexDirection="column">
            <DulcineaInput
              placeholder="Title and Notes search..."
              rightIcon={<MdSearch color="gray.500" />}
              value={searchKeyword}
              onChange={(e) => onSearch(e.target.value)}
            />
          </Flex>
          <Box width="200px">
            <DulcineaSelect
              value={selectedCategoryOption}
              options={categoriesToSelectOptionsMapper(categories)}
              onChange={onChangeCategory}
              placeholder="Category search"
            />
          </Box>
          <Box width="200px">
            <DulcineaSelect
              options={statusOptions}
              value={selectedStatusOption}
              onChange={(newValue) => {
                setSearchStatus(newValue?.value as ArtworkStatus);
                fetchArtworks(
                  searchKeyword,
                  newValue?.value as ArtworkStatus,
                  searchSpotlight,
                  searchCategory
                );
              }}
              placeholder="Status search"
            />
          </Box>
          <Box width="200px">
            <DulcineaSelect
              options={spotlightOptions}
              value={selectedSpotlightOption}
              onChange={(newValue) => {
                setSearchSpotlight(newValue?.value as any);
                fetchArtworks(
                  searchKeyword,
                  searchStatus,
                  newValue?.value as any,
                  searchCategory
                );
              }}
              placeholder="Spotlight search"
            />
          </Box>
        </Flex>
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

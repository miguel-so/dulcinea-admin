import { useState, useEffect } from "react";
import { Box, Flex, IconButton, Button } from "@chakra-ui/react";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";

import Page from "../../components/common/Page";
import { ApiCommand } from "../../lib/Api";
import useToastNotification from "../../lib/hooks/useToastNotification";
import useApi from "../../lib/hooks/useApi";
import urlConstants from "../../lib/constants/url.constants";
import EditCategoryModal from "../../components/categories/EditCategoryModal";
import DulcineaTable from "../../components/common/DulcineaTable";
import DulcineaPagination from "../../components/common/DulcineaPagination";
import DulcineaInput from "../../components/common/DulcineaInput";

const CATEGORY_COLUMNS = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "description",
    label: "Description",
    render: (value: string) =>
      value && value.length > 50 ? value.slice(0, 50) + "..." : value,
  },
];

const {
  createCategory: createCategoryUrl,
  getCategories: getCategoriesUrl,
  editCategory: editCategoryUrl,
  deleteCategory: deleteCategoryUrl,
} = urlConstants.categories;

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const showToast = useToastNotification();

  const { loading: isGetCategoriesLoading, sendRequest: getCategories } =
    useApi<GetCategoriesResopnse>();
  const { loading: isCreateCategoryLoading, sendRequest: createCategory } =
    useApi<any>();
  const { loading: isEditCategoryLoading, sendRequest: editCategory } =
    useApi<any>();
  const { loading: isDeleteCategoryLoading, sendRequest: deleteCategory } =
    useApi<any>();

  const fetchCategories = (searchValue: string) => {
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
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      },
      command: ApiCommand.GET,
      url: getCategoriesUrl,
      options: {
        page: currentPage,
        limit: pageSize,
        searchKeyword: searchValue,
      },
    });
  };

  useEffect(() => {
    fetchCategories(searchKeyword);
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const onSaveCategory = (name: string, description: string) => {
    if (selectedCategory) {
      editCategory({
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
            description: "Category updated successfully",
            status: "success",
          });
          setIsOpenModal(false);
          fetchCategories(searchKeyword);
        },
        command: ApiCommand.PUT,
        url: editCategoryUrl(selectedCategory.id as string),
        options: {
          name,
          description,
        },
      });
    } else {
      createCategory({
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
            description: "Category created successfully",
            status: "success",
          });
          setIsOpenModal(false);
          fetchCategories(searchKeyword);
        },
        command: ApiCommand.POST,
        url: createCategoryUrl,
        options: {
          name,
          description,
        },
      });
    }
  };

  const onDeleteCategory = (categoryId: string) => {
    deleteCategory({
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
          description: "Category deleted successfully",
          status: "success",
        });
        fetchCategories(searchKeyword);
      },
      command: ApiCommand.DELETE,
      url: deleteCategoryUrl(categoryId),
    });
  };

  const onEditCategory = (categoryId: string) => {
    setSelectedCategory(categories.find(({ id }) => id === categoryId));
    setIsOpenModal(true);
  };

  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchCategories(value);
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
          <Flex flexDirection="column">
            <DulcineaInput
              placeholder="Name and Description search..."
              rightIcon={<MdSearch color="gray.500" />}
              value={searchKeyword}
              onChange={(e) => onSearch(e.target.value)}
            />
          </Flex>
        </Box>
        <Button
          colorScheme="teal"
          px={6}
          py={4}
          borderRadius="md"
          fontWeight="bold"
          _hover={{ bg: "teal.300" }}
          onClick={() => {
            setSelectedCategory(undefined);
            setIsOpenModal(true);
          }}
        >
          Create Category
        </Button>
      </Flex>

      <Flex flexDirection="column" height="full" justifyContent="space-between">
        <Box
          backgroundColor="white"
          borderRadius="lg"
          height="calc(100vh - 275px)"
        >
          <DulcineaTable
            columns={CATEGORY_COLUMNS}
            data={categories}
            loading={isGetCategoriesLoading}
            actions={(row) => (
              <>
                <IconButton
                  aria-label="Edit Category"
                  icon={<MdEdit />}
                  variant="outline"
                  colorScheme="teal"
                  size="sm"
                  marginRight={4}
                  onClick={() => onEditCategory(row.id)}
                />
                <IconButton
                  aria-label="Delete Category"
                  icon={<MdDelete />}
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={() => onDeleteCategory(row.id)}
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

      <EditCategoryModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onSubmit={onSaveCategory}
        selectedCategory={selectedCategory}
      />
    </Page>
  );
};

export default Categories;

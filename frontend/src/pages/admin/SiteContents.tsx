import { useState, useEffect } from "react";
import { Box, Flex, IconButton, Button, Tooltip, Text } from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";

import Page from "../../components/common/Page";
import { ApiCommand } from "../../lib/Api";
import useToastNotification from "../../lib/hooks/useToastNotification";
import useApi from "../../lib/hooks/useApi";
import urlConstants from "../../lib/constants/url.constants";
import EditCategoryModal from "../../components/categories/EditCategoryModal";
import DulcineaTable from "../../components/common/DulcineaTable";
import DulcineaPagination from "../../components/common/DulcineaPagination";
import EditSiteContentModal from "../../components/site-contents/EditSiteContentModal";
import { InfoOutlineIcon } from "@chakra-ui/icons";

const SITE_CONTENTS_COLUMNS = [
  {
    key: "item",
    label: "Item",
  },
  {
    key: "value",
    label: "Value",
    render: (value: string) =>
      value && value.length > 50 ? value.slice(0, 50) + "..." : value,
  },
];

const {
  createSiteContent: createSiteContentUrl,
  getSiteContents: getSiteContentsUrl,
  editSiteContent: editSiteContentUrl,
  deleteSiteContent: deleteSiteContentUrl,
} = urlConstants.siteContents;

const SiteContents = () => {
  const [siteContents, setSiteContents] = useState<SiteContent[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedSiteContent, setSelectedSiteContent] = useState<SiteContent>();

  const showToast = useToastNotification();

  const { loading: isGetSiteContentsLoading, sendRequest: getSiteContents } =
    useApi<GetSiteContentsResopnse>();
  const { sendRequest: createSiteContent } = useApi<any>();
  const { sendRequest: editSiteContent } = useApi<any>();
  const { sendRequest: deleteSiteContent } = useApi<any>();

  const fetchSiteContents = () => {
    getSiteContents({
      callback: (
        data: GetSiteContentsResopnse | null,
        error: string | null
      ) => {
        if (error) {
          showToast({
            title: "Failed",
            description: error,
            status: "error",
          });
          return;
        }
        if (!data) return null;
        setSiteContents(data.siteContents);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      },
      command: ApiCommand.GET,
      url: getSiteContentsUrl,
      options: {
        page: currentPage,
        limit: pageSize,
      },
    });
  };

  useEffect(() => {
    fetchSiteContents();
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const onSaveSiteContent = (item: string, value: string) => {
    if (selectedSiteContent) {
      editSiteContent({
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
            description: "Site Content updated successfully",
            status: "success",
          });
          setIsOpenModal(false);
          fetchSiteContents();
        },
        command: ApiCommand.PUT,
        url: editSiteContentUrl(selectedSiteContent.id as string),
        options: {
          item,
          value,
        },
      });
    } else {
      createSiteContent({
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
            description: "Site Content created successfully",
            status: "success",
          });
          setIsOpenModal(false);
          fetchSiteContents();
        },
        command: ApiCommand.POST,
        url: createSiteContentUrl,
        options: {
          item,
          value,
        },
      });
    }
  };

  const onDeleteSiteContent = (siteContentId: string) => {
    deleteSiteContent({
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
          description: "Site Content deleted successfully",
          status: "success",
        });
        fetchSiteContents();
      },
      command: ApiCommand.DELETE,
      url: deleteSiteContentUrl(siteContentId),
    });
  };

  const onEditSiteContent = (siteContentId: string) => {
    setSelectedSiteContent(siteContents.find(({ id }) => id === siteContentId));
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
        <Box flex="1" paddingLeft="20px">
          <Tooltip
            label="These 4 items keyword are essential for site functionality. Please avoid modifying or deleting these items keyword unless necessary, create it if any of them is missing: Artist Bio, Artist Display Name, Artist Instagram Link, Welcome Message."
            placement="right"
            hasArrow
            bg="teal.500"
            color="white"
            fontSize="sm"
            p={3}
            borderRadius="md"
          >
            <Flex
              alignItems="center"
              cursor="pointer"
              width="fit-content"
              _hover={{ color: "teal.500" }}
              gap="10px"
            >
              <InfoOutlineIcon color="teal" boxSize={5} />
              <Text color="teal">Reminder</Text>
            </Flex>
          </Tooltip>
        </Box>
        <Button
          colorScheme="teal"
          px={6}
          py={4}
          borderRadius="md"
          fontWeight="bold"
          _hover={{ bg: "teal.300" }}
          onClick={() => {
            setSelectedSiteContent(undefined);
            setIsOpenModal(true);
          }}
        >
          Create Site Content
        </Button>
      </Flex>

      <Flex flexDirection="column" height="full" justifyContent="space-between">
        <Box
          backgroundColor="white"
          borderRadius="lg"
          height="calc(100vh - 275px)"
        >
          <DulcineaTable
            columns={SITE_CONTENTS_COLUMNS}
            data={siteContents}
            loading={isGetSiteContentsLoading}
            actions={(row) => (
              <>
                <IconButton
                  aria-label="Edit Site Content"
                  icon={<MdEdit />}
                  variant="outline"
                  colorScheme="teal"
                  size="sm"
                  marginRight={4}
                  onClick={() => onEditSiteContent(row.id)}
                />
                <IconButton
                  aria-label="Delete Site Content"
                  icon={<MdDelete />}
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={() => onDeleteSiteContent(row.id)}
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

      <EditSiteContentModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onSubmit={onSaveSiteContent}
        selectedSiteContent={selectedSiteContent}
      />
    </Page>
  );
};

export default SiteContents;

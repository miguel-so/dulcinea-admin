type SiteContent = {
  item: string;
  value: string;
  id: string;
};

type GetSiteContentsResopnse = {
  siteContents: SiteContent[];
  pagination: Pagination;
};

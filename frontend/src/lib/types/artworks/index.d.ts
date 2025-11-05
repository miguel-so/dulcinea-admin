type Artwork = {
  title: string;
  notes: string;
  size: string;
  printNumber: string;
  inventoryNumber: string;
  categoryId: string;
  media: string;
  status: 'Available' | 'On Hold' | 'On Exhibit' | 'Sold';
  thumbnail: string;
  images: string[];
  price?: string;
  location: string;
  id?: string;
  artistId?: string;
};

type GetArtworksResopnse = {
  artworks: Artwork[];
  pagination: Pagination;
};

type GetArtworkByIdResopnse = {
  data: Artwork;
  success: boolean;
};

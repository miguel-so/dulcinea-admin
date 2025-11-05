import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  Stack,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Path } from '../lib/constants/path.constants';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface ArtCardProps {
  title: string;
  notes: string;
  thumbnail: string;
  id?: string;
}

const ArtCard: React.FC<ArtCardProps> = ({ title, notes, thumbnail, id }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Load favorite status from localStorage
  useEffect(() => {
    if (!id) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(id));
  }, [id]);

  // Toggle favorite and save to localStorage
  const toggleFavorite = () => {
    if (!id) return;
    const favorites: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
      setIsFavorite(false);
    } else {
      updatedFavorites = [...favorites, id];
      setIsFavorite(true);
    }
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <Box overflow='hidden' boxShadow='sm' bg='#f1ffe9' textAlign='center' m={2}>
      <Image
        src={`${process.env.REACT_APP_API_URL}/artworks/${thumbnail}`}
        alt={title}
        objectFit='cover'
        w='100%'
        h='250px'
        onContextMenu={(e) => e.preventDefault()}
      />
      <Stack spacing={2} p={4}>
        <Heading as='h5' size='md'>
          {title}
        </Heading>
        <Text fontSize='sm' color='gray.600'>
          {notes}
        </Text>
        <VStack direction='row' spacing={2} justify='center'>
          {id && (
            <Button
              colorScheme='green'
              size='md'
              onClick={() => navigate(`${Path.ARTWORK_DETAILS}/${id}`)}
            >
              See Details
            </Button>
          )}
          <Button
            colorScheme={isFavorite ? 'red' : 'yellow'}
            size='md'
            onClick={toggleFavorite}
            leftIcon={<Icon as={isFavorite ? FaHeart : FaRegHeart} />}
          >
            {isFavorite ? 'Favorited' : 'Mark Favorite'}
          </Button>
        </VStack>
      </Stack>
    </Box>
  );
};

export default ArtCard;

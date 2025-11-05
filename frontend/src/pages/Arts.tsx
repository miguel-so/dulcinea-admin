import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import ArtCard from '../components/ArtCard';
import urlConstants from '../lib/constants/url.constants';
import useToastNotification from '../lib/hooks/useToastNotification';
import useApi from '../lib/hooks/useApi';
import { ApiCommand } from '../lib/Api';

const { getArtworks: getArtworksUrl } = urlConstants.artworks;

const Arts: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  const showToast = useToastNotification();

  const { loading: isGetArtworksLoading, sendRequest: getArtworks } =
    useApi<GetArtworksResopnse>();

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = () => {
    getArtworks({
      callback: (data: GetArtworksResopnse | null, error: string | null) => {
        if (error) {
          showToast({
            title: 'Failed',
            description: error,
            status: 'error',
          });
          return;
        }
        if (!data) return null;
        setArtworks(data.artworks);
      },
      command: ApiCommand.GET,
      url: getArtworksUrl,
      options: {
        all: 'true',
      },
    });
  };

  return (
    <Box>
      <Box
        bgGradient='linear(to-r, teal.400, green.300)'
        color='white'
        paddingTop={{ base: 20, md: 24 }}
        paddingBottom={{ base: 8, md: 12 }}
        textAlign='center'
      >
        <Container maxW='container.lg'>
          <Heading as='h1' size='2xl' mb={4}>
            Arts
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} mb={6}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, <br />
            sed eiusmod tempor incididunt labore dolore magna aliqua.
          </Text>
          <Button colorScheme='yellow' size='lg'>
            View More
          </Button>
        </Container>
      </Box>

      {/* Art Cards Section */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={1} p={4}>
        {artworks.map((art) => (
          <ArtCard
            key={art.id}
            title={art.title}
            notes={art.notes}
            thumbnail={art.thumbnail}
            id={art.id}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Arts;

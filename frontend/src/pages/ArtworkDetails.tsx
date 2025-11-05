import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  Image,
} from '@chakra-ui/react';
import { MdPhone } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { Path } from '../lib/constants/path.constants';
import urlConstants from '../lib/constants/url.constants';
import useApi from '../lib/hooks/useApi';
import { ApiCommand } from '../lib/Api';
import useToastNotification from '../lib/hooks/useToastNotification';

const mainWidth = 400;
const mainHeight = 400;

// Zoom configuration
const zoomFactor = 3;
const zoomWidth = 400;
const zoomHeight = 400;

const { getArtworkById: getArtworkByIdUrl } = urlConstants.artworks;

const ArtworkDetails: React.FC = () => {
  const { artworkId } = useParams();
  const [artwork, setArtwork] = useState<Artwork>();
  const [selectedImage, setSelectedImage] = useState('');
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPos, setZoomPos] = useState({
    x: 0,
    y: 0,
    zoomLeft: 0,
    zoomTop: 0,
    renderedWidth: mainWidth,
    renderedHeight: mainHeight,
    offsetX: 0,
    offsetY: 0,
  });

  const mainRef = useRef<HTMLDivElement>(null);
  const { sendRequest: getArtworkById } = useApi<GetArtworkByIdResopnse>();
  const showToast = useToastNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (artworkId) fetchArtwork();
  }, []);

  const fetchArtwork = () => {
    if (!artworkId) return;

    getArtworkById({
      callback(data: GetArtworkByIdResopnse | null, error) {
        if (error) {
          showToast({ title: 'Failed', description: error, status: 'error' });
          return;
        }
        setArtwork(data?.data);
        setSelectedImage(data?.data?.thumbnail || '');
      },
      command: ApiCommand.GET,
      url: getArtworkByIdUrl(artworkId),
    });
  };

  const onContact = () => {
    navigate(`${Path.CONTACT}/${artworkId}`);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mainRef.current) return;

    const rect = mainRef.current.getBoundingClientRect();
    const img = mainRef.current.querySelector('img') as HTMLImageElement;
    if (!img) return;

    // Actual image aspect ratio vs container
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = rect.width / rect.height;

    let renderedWidth, renderedHeight, offsetX, offsetY;

    if (imgRatio > containerRatio) {
      // Image is wider
      renderedWidth = rect.width;
      renderedHeight = rect.width / imgRatio;
      offsetX = 0;
      offsetY = (rect.height - renderedHeight) / 2;
    } else {
      // Image is taller
      renderedHeight = rect.height;
      renderedWidth = rect.height * imgRatio;
      offsetX = (rect.width - renderedWidth) / 2;
      offsetY = 0;
    }

    // Cursor relative to visible image
    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top - offsetY;

    x = Math.max(0, Math.min(x, renderedWidth));
    y = Math.max(0, Math.min(y, renderedHeight));

    // Zoom window position on screen
    let zoomLeft = e.clientX + 20;
    let zoomTop = e.clientY + 20;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (zoomLeft + zoomWidth > viewportWidth)
      zoomLeft = e.clientX - zoomWidth - 20;
    if (zoomTop + zoomHeight > viewportHeight)
      zoomTop = e.clientY - zoomHeight - 20;

    setZoomPos({
      x,
      y,
      zoomLeft,
      zoomTop,
      renderedWidth,
      renderedHeight,
      offsetX,
      offsetY,
    });
  };

  const getBgPosition = () => {
    const { x, y, renderedWidth, renderedHeight } = zoomPos;

    const maxX = renderedWidth * zoomFactor - zoomWidth;
    const maxY = renderedHeight * zoomFactor - zoomHeight;

    let bgX = x * zoomFactor - zoomWidth / 2;
    let bgY = y * zoomFactor - zoomHeight / 2;

    bgX = Math.max(0, Math.min(bgX, maxX));
    bgY = Math.max(0, Math.min(bgY, maxY));

    return `${-bgX}px ${-bgY}px`;
  };

  return (
    <Box
      bgImage="url('/art-details-bg.jpg')"
      bgPosition='center'
      bgRepeat='repeat-y'
      pt={16}
    >
      <Container
        maxW='3xl'
        py={{ base: '2rem', md: '4rem' }}
        px={{ base: '1.5rem', md: '4rem' }}
        my={{ base: 4, md: 16 }}
        height={{ base: '335px', md: '343px' }}
        textAlign='center'
        bg='white'
        boxShadow='lg'
        borderRadius='md'
      >
        <Heading as='h1' size='xl' mb={8} fontWeight='bold' color='#1f6463'>
          "{artwork?.title}"
        </Heading>
        <Text fontSize='lg' mb={8} color='#1f6463'>
          {artwork?.notes}
        </Text>
        <Button
          backgroundColor='#1f6463'
          colorScheme='green'
          rightIcon={<MdPhone />}
          _hover={{ backgroundColor: '#1f6463', opacity: 0.9 }}
          onClick={onContact}
        >
          Contact Artist
        </Button>
      </Container>

      <Box py={16}>
        <Container maxW='6xl' textAlign='center'>
          <Box
            ref={mainRef}
            display='inline-block'
            width={`${mainWidth}px`}
            height={`${mainHeight}px`}
            position='relative'
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setZoomVisible(true)}
            onMouseLeave={() => setZoomVisible(false)}
            cursor='crosshair'
            borderRadius='md'
            overflow='hidden'
            bg='gray.100'
          >
            <Image
              src={`${process.env.REACT_APP_API_URL}/artworks/${selectedImage}`}
              alt='Main Artwork'
              width='100%'
              height='100%'
              objectFit='contain'
              objectPosition='center'
              borderRadius='md'
              onContextMenu={(e) => e.preventDefault()}
            />
          </Box>

          {zoomVisible && (
            <Box
              position='fixed'
              width={`${zoomWidth}px`}
              height={`${zoomHeight}px`}
              top={`${zoomPos.zoomTop}px`}
              left={`${zoomPos.zoomLeft}px`}
              border='2px solid #1f6463'
              borderRadius='md'
              pointerEvents='none'
              bgColor='white'
              bgImage={`url(${process.env.REACT_APP_API_URL}/artworks/${selectedImage})`}
              bgRepeat='no-repeat'
              bgSize={`${zoomPos.renderedWidth * zoomFactor}px ${
                zoomPos.renderedHeight * zoomFactor
              }px`}
              bgPosition={getBgPosition()}
            />
          )}

          <HStack mt={4} spacing={4} justify='center'>
            {artwork
              ? [...artwork.images, artwork.thumbnail].map((img, idx) => (
                  <Box
                    key={idx}
                    border={
                      img === selectedImage
                        ? '2px solid #1f6463'
                        : '2px solid transparent'
                    }
                    borderRadius='md'
                    cursor='pointer'
                    onClick={() => setSelectedImage(img)}
                  >
                    <Image
                      src={`${process.env.REACT_APP_API_URL}/artworks/${img}`}
                      alt={`Artwork ${idx + 1}`}
                      boxSize='80px'
                      objectFit='cover'
                      borderRadius='md'
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </Box>
                ))
              : null}
          </HStack>
        </Container>
        <Box py={16}>
          <Container maxW='6xl' textAlign='center'>
            <Box p={6} fontSize='18px' color='rgb(53, 53, 53)' lineHeight='25px'>
              <ul
                style={{
                  textAlign: 'left',
                  listStyleType: 'none',
                  paddingLeft: 0,
                }}
              >
                <Text>
                  <strong>Detail 1:</strong>{' '}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt labore dolore magna aliqua.
                </Text>
                <Text mt='12px'>
                  <strong>Detail 2:</strong>{' '}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt labore dolore magna aliqua.
                </Text>
                <Text mt='12px'>
                  <strong>Detail 3:</strong>{' '}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt labore dolore magna aliqua.
                </Text>
              </ul>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ArtworkDetails;

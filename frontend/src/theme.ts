import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "'Inter Tight', sans-serif",
        color: 'gray.800',
      },
    },
  },
  colors: {
    primary: {
      green: '#1f6463',
      yellow: '#ffa600',
      lightGreen: 'rgb(241, 255, 233)',
      paleGreen: 'rgb(239, 255, 228)',
    },
  },
  fonts: {
    body: 'Inter Tight, sans-serif',
    heading: 'Inter Tight, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        borderRadius: 'md',
      },
      variants: {
        success: {
          bg: 'primary.green',
          color: 'white',
          _hover: {
            bg: 'primary.green',
            opacity: 0.9,
          },
        },
        warning: {
          bg: 'primary.yellow',
          color: 'white',
          _hover: {
            bg: 'primary.yellow',
            opacity: 0.9,
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        color: 'gray.800',
      },
    },
    Box: {
      baseStyle: {
        '.md-pb': {
          paddingBottom: { base: '2rem', md: 0 }
        }
      }
    }
  },
});
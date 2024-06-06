import { Spinner } from '@chakra-ui/react';

const extend_theme = {
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
        fontFamily: 'poppins, sans-serif',
      },
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      fontWeights: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      lineHeights: {
        normal: 'normal',
        none: 1,
        shorter: 1.25,
        short: 1.375,
        base: 1.5,
        tall: 1.625,
        taller: '2',
        3: '.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
      },
      letterSpacings: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },
  components: {
    FormControl: {
      baseStyle: {
        my: 4,
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: 'sm',
        fontWeight: 'bold',
        mb: 2,
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'white',
          borderColor: 'gray.300',
          _hover: {
            borderColor: 'gray.400',
          },
          _focus: {
            borderColor: 'blackAlpha.900',
            boxShadow: '0 0 0 1px blue.500',
          },
        },
      },
      sizes: {
        md: {
          field: {
            borderRadius: 'md',
          },
        },
      },
      defaultProps: {
        borderRadius: 'none',
        size: 'md',
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        bg: 'blackAlpha.900',
        borderRadius: 'none',
      },
      sizes: {
        md: {
          height: '48px',
          fontSize: 'md',
          px: '24px',
        },
      },
      variants: {
        flat: {
          bg: 'blackAlpha.900',
          color: 'white',
          _hover: {
            bg: 'blackAlpha.800',
          },
          _active: {
            bg: 'blackAlpha.700',
          },
        },
        outline: {
          bg: 'white',
          color: 'blackAlpha',
          border: 'blackAlpha.400',
          _hover: {
            border: 'blackAlpha.500',
          },
          _active: {
            border: 'blackAlpha.600',
          },
        },
        bezel: {
          bgGradient: 'linear(to-r, whiteAlpha.200, whiteAlpha.500)', // Customize colors here
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, whiteAlpha.500, whiteAlpha.700)', // Adjust hover colors
          },
          _active: {
            bgGradient: 'linear(to-r, whiteAlpha.700, whiteAlpha.900)', // Adjust active colors
          },
        },
        outline_transparent: {
          bg: 'transparent',
          color: 'blackAlpha',
          border: '1px solid',
          borderColor: 'blackAlpha',
        },
      },
      defaultProps: {
        size: 'md',
        variant: 'flat',
      },
    },
    IconButton: {
      baseStyle: {
        fontWeight: 'bold',
        bg: 'blackAlpha.900',
      },
      sizes: {
        md: {
          height: '48px',
          fontSize: 'md',
          px: '24px',
        },
      },
      variants: {
        flat: {
          bg: 'blackAlpha.900',
          color: 'white',
          _hover: {
            bg: 'blackAlpha.800',
          },
          _active: {
            bg: 'blackAlpha.700',
          },
        },
        outline: {
          bg: 'white',
          color: 'blackAlpha',
          border: 'blackAlpha.400',
          _hover: {
            border: 'blackAlpha.500',
          },
          _active: {
            border: 'blackAlpha.600',
          },
        },
        bezel: {
          bgGradient: 'linear(to-r, whiteAlpha.200, whiteAlpha.500)', // Customize colors here
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, whiteAlpha.500, whiteAlpha.700)', // Adjust hover colors
          },
          _active: {
            bgGradient: 'linear(to-r, whiteAlpha.700, whiteAlpha.900)', // Adjust active colors
          },
        },
      },
      defaultProps: {
        size: 'md',
        variant: 'flat',
      },
    },
    FormErrorMessage: {
      baseStyle: {
        textColor: 'red.500',
        mt: 1,
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        fontFamily: 'poppins, sans-serif',
        mb: 4,
      },
      sizes: {
        xl: {
          fontSize: '5xl',
        },
        lg: {
          fontSize: '4xl',
        },
        md: {
          fontSize: '3xl',
        },
        sm: {
          fontSize: '2xl',
        },
        xs: {
          fontSize: 'lg',
        },
      },
    },
    Text: {
      baseStyle: {
        textAlign: 'justify',
      },
    },
    Box: {
      baseStyle: {
        borderRadius: 'none',
      },
    },
  },
};
export default extend_theme;

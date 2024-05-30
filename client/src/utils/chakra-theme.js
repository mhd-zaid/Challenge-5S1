const extend_theme = {
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
        fontFamily: 'poppins, sans-serif',
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
          }
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
          }
        },
        bezel: {
          bgGradient: 'linear(to-r, whiteAlpha.200, whiteAlpha.500)', // Customize colors here
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, whiteAlpha.500, whiteAlpha.700)', // Adjust hover colors
          },
          _active: {
            bgGradient: 'linear(to-r, whiteAlpha.700, whiteAlpha.900)', // Adjust active colors
          }
        }
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
          }
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
          }
        },
        bezel: {
          bgGradient: 'linear(to-r, whiteAlpha.200, whiteAlpha.500)', // Customize colors here
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, whiteAlpha.500, whiteAlpha.700)', // Adjust hover colors
          },
          _active: {
            bgGradient: 'linear(to-r, whiteAlpha.700, whiteAlpha.900)', // Adjust active colors
          }
        }
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
        fontWeight: "bold",
        fontFamily: "poppins, sans-serif",
        mb: 4,
      },
      sizes: {
        xl: {
          fontSize: "5xl",
        },
        lg: {
          fontSize: "4xl",
        },
        md: {
          fontSize: "3xl",
        },
        sm: {
          fontSize: "2xl",
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
      }
    },
  },
};
export default extend_theme;

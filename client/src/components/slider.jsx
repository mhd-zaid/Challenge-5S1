import React, { useState } from 'react';
import { Box, IconButton, Image, Card, CardBody, CardFooter, Stack,Heading,Button,Text} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Slider = ({ sliders }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? sliders.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const isLastSlide = currentIndex === sliders.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        boxShadow='xl'
        rounded='md'
        position="relative"
      >
        <Image 
          src={sliders[currentIndex].image} 
          alt={`Slide ${currentIndex}`} 
          boxSize="md" 
          objectFit='cover' 
          marginBottom="2em" 
        />
        <Stack> 
          <CardBody maxW="38em" display="flex" flexDirection="column" justifyContent="space-around" alignItems="center">
            <Heading size='md' fontFamily="Poppins, sans-serif">{sliders[currentIndex].title}</Heading>
            <Text py='2' textAlign="justify" fontFamily="Poppins, sans-serif">
              {sliders[currentIndex].description}
            </Text>
          </CardBody>

          <CardFooter>
            <IconButton
              icon={<FaArrowLeft />}
              onClick={handlePrev}
              aria-label="Previous Slide"
              bgColor="transparent"
              _hover={{ bgColor: 'gray.200' }}
            />
            <IconButton
              icon={<FaArrowRight />}
              onClick={handleNext}
              aria-label="Next Slide"
              bgColor="transparent"
              __hover={{ bgColor: 'gray.200' }}
            />
          </CardFooter>
        </Stack>
      </Card>
    </Box>
  );
};

export default Slider;

import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import { CiLocationOn } from 'react-icons/ci';
import { useTranslation } from 'react-i18next';

const StudioPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [studioData, setStudioData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getStudioData = async () => {
      setIsLoading(true);
      await fetch(import.meta.env.VITE_BACKEND_URL + `/studios/${id}`)
        .then(res => {
          if (!res.ok) return;
          return res.json();
        })
        .then(data => {
          setStudioData(data);
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    };

    if (id) getStudioData();
  }, [id]);

  if (!id || isLoading)
    return (
      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        <Spinner size={'xl'} />
      </Flex>
    );
  if (!studioData) return <NotFoundPage />;

  return (
    <Box w="full" h="full" p={8}>
      <Flex justifyContent={'space-between'} alignItems={'end'}>
        <Box>
          <Heading>{studioData.name}</Heading>
          <Flex
            as={Link}
            alignItems="center"
            textDecor={'underline'}
            href={`https://www.google.com/maps/search/${studioData.address},  ${studioData.zipCode} ${studioData.city}`}
            target="__blank"
          >
            <CiLocationOn size={18} />
            {`${studioData.address},  ${studioData.zipCode} ${studioData.city}`}
          </Flex>
        </Box>
        <Button>{t('studio.reservation-btn')}</Button>
      </Flex>
      <Box mt={4} h={60}>
        <Image
          src={studioData.image}
          alt={studioData.name}
          bgColor={'gray'}
          w={'full'}
          h={'full'}
        />
      </Box>
    </Box>
  );
};

export default StudioPage;

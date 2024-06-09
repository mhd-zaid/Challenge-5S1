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
  const [studio, setStudio] = useState();
  const [studioServices, setStudioServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getStudio();
    }
  }, [id]);

  const getStudio = async () => {
    setIsLoading(true);
    await fetch(import.meta.env.VITE_BACKEND_URL + `/studios/${id}`)
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        setStudio(data);
        getStudioServices();
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const getStudioServices = async () => {
    setIsLoading(true);
    await fetch(import.meta.env.VITE_BACKEND_URL + `/services?studio=${id}`)
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        setStudioServices(data['hydra:member']);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  if (!id || isLoading)
    return (
      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        <Spinner size={'xl'} />
      </Flex>
    );
  if (!studio) return <NotFoundPage />;

  return (
    <Box w="full" h="full" p={8}>
      <Flex justifyContent={'space-between'} alignItems={'end'}>
        <Box>
          <Heading>{studio.name}</Heading>
          <Flex
            as={Link}
            alignItems="center"
            textDecor={'underline'}
            href={`https://www.google.com/maps/search/${studio.address},  ${studio.zipCode} ${studio.city}`}
            target="__blank"
          >
            <CiLocationOn size={18} />
            {`${studio.address},  ${studio.zipCode} ${studio.city}`}
          </Flex>
        </Box>
        <Button>{t('studio.reservation-btn')}</Button>
      </Flex>
      <Box mt={4} h={60}>
        <Image
          src={studio.image}
          alt={studio.name}
          bgColor={'gray'}
          w={'full'}
          h={'full'}
        />
      </Box>
      <Box mt={4}>
        <Heading size={'sm'}>{t('studio.prestation-choice')}</Heading>
        {studioServices.map(service => (
          <Box key={service.id}>
            <Heading size={'xs'}>{service.name}</Heading>
            <Box>{service.description}</Box>
            <Box>{service.cost} €</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StudioPage;

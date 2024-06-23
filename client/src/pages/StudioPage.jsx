import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import { CiLocationOn } from 'react-icons/ci';
import { useTranslation } from 'react-i18next';
import { scroller } from 'react-scroll';
import useCustomDate from '@/hooks/useCustomDate';

const StudioPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const d = useCustomDate();
  const [studio, setStudio] = useState();
  const [studioServices, setStudioServices] = useState([]);
  const [studioOpeningHours, setStudioOpeningHours] = useState([]);
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
        setStudioServices(data.services);
        getOpeningHours();
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const getOpeningHours = async () => {
    setIsLoading(true);
    await fetch(
      import.meta.env.VITE_BACKEND_URL + `/studio_opening_times?studio=${id}`,
    )
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        setStudioOpeningHours(data['hydra:member']);
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
    <Box w="full" p={8} py={24}>
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
        <Button
          onClick={() => {
            scroller.scrollTo('prestation-choice', {
              duration: 600,
              delay: 0,
              smooth: 'smooth',
              offset: -100,
            });
          }}
        >
          {t('studio.reservation-btn')}
        </Button>
      </Flex>
      <Box mt={4} h={60}>
        <Image
          src={studio.image || 'https://picsum.photos/1000/400'}
          alt={studio.name}
          bgColor={'gray'}
          w={'full'}
          h={'full'}
        />
      </Box>
      <Flex py={10}>
        <Flex flexDir={'column'} flex={7}>
          <Heading id="prestation-choice" size={'sm'}>
            {t('studio.prestation-choice')}
          </Heading>
          <Box bgColor={'white'} px={4} mr={6}>
            {studioServices.map((service, i) => (
              <Fragment key={service.id}>
                {i !== 0 && <Divider />}
                <Flex
                  as={Link}
                  href={`/studios/${id}/reservation/${service.id}`}
                  _hover={{ textDecor: 'none' }}
                  py={4}
                  justifyContent="space-between"
                  alignItems={'center'}
                >
                  <Text>{service.name}</Text>
                  <Flex alignItems={'center'}>
                    <Text>1h</Text>
                    <Box
                      w={1}
                      h={1}
                      rounded={'full'}
                      bgColor={'gray.100'}
                      mx={2}
                    />
                    <Text mr={6}>{service.cost} €</Text>
                    <Button>{t('studio.book')}</Button>
                  </Flex>
                </Flex>
              </Fragment>
            ))}
          </Box>
        </Flex>
        <Flex flexDir={'column'} flex={3}>
          <Heading size={'sm'}>{t('studio.opening-hours')}</Heading>
          <Box bgColor={'white'} px={4}>
            {Array.from({ length: 7 }, (_, i) => i).map((day, i) => {
              const openingHour = studioOpeningHours.find(
                openingHour => openingHour.day === day,
              );
              return (
                <Fragment key={day}>
                  {i !== 0 && <Divider />}
                  <Flex
                    justifyContent="space-between"
                    alignItems={'center'}
                    py={4}
                  >
                    <Text as={'b'} textTransform={'uppercase'} fontSize={'sm'}>
                      {d().weekday(day).format('dddd')}
                    </Text>
                    <Text
                      fontWeight={openingHour && 'medium'}
                      fontStyle={!openingHour && 'italic'}
                    >
                      {openingHour
                        ? d(openingHour.startTime).format('HH:mm') +
                          ' - ' +
                          d(openingHour.endTime).format('HH:mm')
                        : t('studio.closed')}
                    </Text>
                  </Flex>
                </Fragment>
              );
            })}
          </Box>
        </Flex>
      </Flex>

      {studio.description && (
        <Flex flexDir={'column'} flex={7}>
          <Heading size={'sm'}>{t('studio.about')}</Heading>
          <Box bgColor={'white'} p={4}>
            <Text>{studio.description}</Text>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default StudioPage;

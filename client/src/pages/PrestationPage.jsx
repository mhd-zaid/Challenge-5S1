import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Spinner,
  Image,
  Divider,
  Heading,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';

const PrestationPage = () => {
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const city =
    queryParams.get('city') === undefined ? null : queryParams.get('city');
  const service =
    queryParams.get('service') === undefined
      ? null
      : parseInt(queryParams.get('service'));

  useEffect(() => {
    getPrestas();
  }, []);

  const getPrestas = async () => {
    setLoading(true);
    let url = import.meta.env.VITE_BACKEND_URL + '/services';
    if (city !== null && service !== null) {
      url += `?id=${service}&studio.city=${city}`;
    } else if (service !== null) {
      url += `?id=${service}`;
    } else if (city !== null) {
      url += `?studio.city=${city}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    setPrestations(data['hydra:member']);
    setLoading(false);
  };

  return (
    <Box pt={100} w h={'100%'}>
      <Flex display={'flex'} justifyContent={'space-between'}>
        <Heading textAlign={'start'} size={'xs'} px={'2%'}>
          Séléctionner un studio
        </Heading>
        <Button
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          gap={4}
          mx={'2%'}
          mb={'2%'}
          variant={'outline_transparent'}
        >
          <Icon
            icon="mage:filter"
            width="1.5em"
            height="1.5em"
            style={{ color: 'black' }}
          />
          Filtrer
        </Button>
      </Flex>
      {loading ? (
        <Flex justifyContent={'center'} alignItems={'center'} h={'30vh'}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.400"
            color="blackAlpha.900"
            size="xl"
          />
        </Flex>
      ) : prestations.length === 0 ? (
        <Flex justifyContent={'center'} alignItems={'center'} h={'30vh'}>
          <Heading size={'md'}>Aucun résultat trouvé</Heading>
        </Flex>
      ) : (
        <>
          {prestations.map((prestation, index) => (
            <Box w={'100%'} h={'fit-content'} p={2}>
              <Flex>
                <Flex>
                  <Image
                    borderRadius={'lg'}
                    src={`https://source.unsplash.com/random/300x200/?${prestation.name}`}
                  />
                </Flex>
                <Flex flexDirection={'column'} py={2} px={5}>
                  <Text fontSize={'2xl'} fontWeight={'semibold'}>
                    {prestation.studio.name}
                  </Text>
                  <Flex alignItems={'center'} gap={2}>
                    <Icon icon="tabler:location" style={{ color: 'gray' }} />
                    <Text fontSize={'md'}>{prestation.studio.fullAddress}</Text>
                  </Flex>
                  <Flex alignItems={'center'} gap={2}>
                    <Icon icon="ph:star-bold" style={{ color: 'gray' }} />
                    <Text fontSize={'md'}>
                      {(Math.floor(Math.random() * 5) + 1)
                        .toFixed(1)
                        .replace('.', ',')}{' '}
                      ({Math.floor(Math.random() * 500)} avis) -{' '}
                      {prestation.cost} €{' '}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                p={2}
              >
                <Text as={'u'} cursor={'pointer'}>
                  Plus d'information
                </Text>
                <Button variant={'flat'}>Prendre RDV</Button>
              </Flex>
              {index === prestations.length - 1 ? null : (
                <Divider
                  borderColor="black"
                  width={'80%'}
                  ml={'10%'}
                  my={'2%'}
                />
              )}
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default PrestationPage;

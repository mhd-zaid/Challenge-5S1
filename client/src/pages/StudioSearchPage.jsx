import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Spinner,
  Image,
  Divider,
  Heading,
  Link,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const StudioSearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const city =
    queryParams.get('city') === null ? null : queryParams.get('city');
  const service =
    queryParams.get('service') === null
      ? null
      : parseInt(queryParams.get('service'));

  useEffect(() => {
    getStudios();
  }, []);

  const getStudios = async () => {
    setLoading(true);
    let url = import.meta.env.VITE_BACKEND_URL + '/studios';
    if (city !== null && service !== null) {
      url += `?services.id=${service}&city=${city}`;
    } else if (service !== null) {
      url += `?services.id=${service}`;
    } else if (city !== null) {
      url += `?city=${city}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/ld+json',
      },
    });
    const data = await response.json();

    for (let i = 0; i < data['hydra:member']?.length; i++) {
      const coords = await getCoordinates(data['hydra:member'][i].fullAddress);
      if (coords !== null) {
        data['hydra:member'][i].coords = coords;
      }
    }
    setStudios(data['hydra:member']);
    setLoading(false);
  };

  const getCoordinates = async address => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`;
      const response = await fetch(url);

      const data = await response.json();

      if (data.length > 0) {
        return [parseFloat(data[0]['lat']), parseFloat(data[0]['lon'])];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des coordonnées :', error);
      return null;
    }
  };

  const createStat = async studio => {
    await fetch(import.meta.env.VITE_BACKEND_URL + `/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
      },
      body: JSON.stringify({
        studio: studio['@id'],
        date: new Date().toISOString(),
        ip: randomIp(),
      }),
    });
  };

  const randomIp = () => {
    return Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 256).toString(),
    ).join('.');
  };

  return (
    <Box pt={8}>
      <Flex display={'flex'} justifyContent={'space-between'}>
        <Heading textAlign={'start'} size={'xs'} px={'2%'}>
          {t('studio-search.select-studio')}
        </Heading>
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
      ) : studios.length === 0 ? (
        <Flex justifyContent={'center'} alignItems={'center'} h={'30vh'}>
          <Heading size={'md'}>{t('studio-search.no-results')}</Heading>
        </Flex>
      ) : (
        <Flex
          display={'flex'}
          justifyContent={'space-between'}
          alignItems="start"
        >
          <Flex display={'flex'} flexDirection={'column'} w={'100%'}>
            {studios.map((studio, index) => (
              <Box w={'100%'} h={'fit-content'} p={2} key={index}>
                <Flex>
                  <Flex>
                    <Image
                      borderRadius={'lg'}
                      src={`https://picsum.photos/200/300`}
                    />
                  </Flex>
                  <Flex flexDirection={'column'} py={2} px={5}>
                    <Text fontSize={'2xl'} fontWeight={'semibold'}>
                      {studio.name}
                    </Text>
                    <Flex alignItems={'center'} gap={2}>
                      <Icon icon="tabler:location" style={{ color: 'gray' }} />
                      <Text fontSize={'md'}>{studio.fullAddress}</Text>
                    </Flex>
                    <Flex alignItems={'center'} gap={2}>
                      <Icon icon="ph:star-bold" style={{ color: 'gray' }} />
                      <Text fontSize={'md'}>
                        {studio.averageNote === 0
                          ? '-'
                          : studio.averageNote
                              .toFixed(1)
                              .toString()
                              .replace('.', ',')}{' '}
                        ({studio.nbrFeedbacks} avis) -{' '}
                        {service === null
                          ? '€€€'
                          : studio.services.find(
                              element => element.id === service,
                            )?.cost ?? '€€€'}{' '}
                        €{' '}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  p={2}
                >
                  <Link href={`/studios/${studio.id}`}>
                    {t('studio-search.more-info')}
                  </Link>

                  <Button
                    onClick={() => {
                      createStat(studio);
                      navigate(`/studios/${studio.id}`);
                    }}
                  >
                    {t('studio.reservation-btn')}
                  </Button>
                </Flex>
                {index === studios.length - 1 ? null : (
                  <Divider
                    borderColor="black"
                    width={'80%'}
                    ml={'10%'}
                    my={'2%'}
                  />
                )}
              </Box>
            ))}
          </Flex>
          <Box w={'100%'} h={'100vh'} p={1} position={'sticky'} top={100}>
            <MapContainer
              center={studios[0].coords}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {studios.map((studio, index) => {
                return (
                  <Marker position={studio.coords} key={index}>
                    <Popup>
                      {studio.name} <br /> {studio.fullAddress}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default StudioSearchPage;

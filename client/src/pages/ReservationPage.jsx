import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useCustomDate from '../hooks/useCustomDate';
import NotFoundPage from './NotFoundPage';
import { CiLocationOn } from 'react-icons/ci';
import { useAuth } from '@/context/AuthContext.jsx';

const ReservationPage = () => {
  const { t } = useTranslation();
  const { id, service_id } = useParams();
  const d = useCustomDate();
  const { user, token } = useAuth();

  const [studio, setStudio] = useState();
  const [service, setService] = useState();
  const [availableHours, setAvailableHours] = useState([]); // {"2024-06-24": [{"start":"10:00", "end": "11:00", "userId": 46, "fullname": "John Doe"}, {"start":"11:00", "end": "12:00", "userId": 46, "fullname": "John Doe"].....}
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDayHour, setSelectedDayHour] = useState();
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
        const service = data.services.find(s => s.id == service_id);
        if (!service) return;
        setStudio(data);
        setService(service);
        getAvailableHours();
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const getAvailableHours = async () => {
    setIsLoading(true);
    await fetch(import.meta.env.VITE_BACKEND_URL + `/available_slots/${id}`)
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        setAvailableHours(data);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const generateFourWeeksAhead = () => {
    const weeks = [[], [], [], []]; // Initialize 4 arrays for 4 weeks
    let currentDate = d(); // Start from today

    for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
      // For the first week, start from today. For subsequent weeks, start from the day after the last day of the previous week.
      const weekStart = currentDate;
      const weekEnd = weekStart.add(1, 'week');

      // Generate days for the current week
      let currentDay = weekStart;
      while (
        currentDay.isBefore(weekEnd) ||
        currentDay.isSame(weekEnd, 'day')
      ) {
        weeks[weekIndex].push(currentDay.format('YYYY-MM-DD'));
        currentDay = currentDay.add(1, 'day');
      }

      // Prepare for the next week by setting currentDate to the day after the last day of the current week
      currentDate = weekEnd.add(1, 'day');
    }

    return weeks;
  };

  const getAvailableHoursForDay = day => {
    const daySlots = availableHours[day];
    if (!daySlots) return [];
    return daySlots;
  };

  const createReservation = async () => {
    if (!user || !selectedDayHour) return;
    setIsLoading(true);
    await fetch(import.meta.env.VITE_BACKEND_URL + `/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer_id: user.id,
        employee_id: selectedDayHour.userId,
        service_id: service_id,
        studio_id: id,
        date: selectedDayHour.date,
      }),
    })
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  if (!id || !service_id || isLoading)
    return (
      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        <Spinner size={'xl'} />
      </Flex>
    );
  if (!studio) return <NotFoundPage />;

  return (
    <Box w="full" p={8} py={24}>
      <Box>
        <Heading size={'md'}>{studio.name}</Heading>
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
      <Box mt={8}>
        <Heading size={'sm'}>{t('studio.chosen-presta')}</Heading>
        <Flex justifyContent={'space-between'} bgColor={'white'} p={6}>
          <Text>{service.name}</Text>
          <Flex alignItems={'center'}>
            <Text>1h</Text>
            <Box w={1} h={1} rounded={'full'} bgColor={'gray.100'} mx={2} />
            <Text fontWeight={'medium'}>{service.cost} €</Text>
          </Flex>
        </Flex>
      </Box>
      <Box mt={8}>
        <Heading size={'sm'}>{t('studio.chosen-date')}</Heading>
        <Flex alignItems="center" p={2}>
          <Button
            variant="unstyled"
            isDisabled={selectedWeek <= 0}
            onClick={() => setSelectedWeek(selectedWeek => selectedWeek - 1)}
          >
            &lt;
          </Button>
          <Text fontWeight="medium" mx={4}>
            {d(generateFourWeeksAhead()[selectedWeek][0]).format('DD/MM')}
            &nbsp;-&nbsp;
            {d(generateFourWeeksAhead()[selectedWeek][7]).format('DD/MM')}
          </Text>
          <Button
            variant="unstyled"
            isDisabled={3 < selectedWeek + 1}
            onClick={() => setSelectedWeek(selectedWeek => selectedWeek + 1)}
          >
            &gt;
          </Button>
        </Flex>
        <Flex bgColor={'white'} p={6} minH={'50vh'}>
          {generateFourWeeksAhead()[selectedWeek].map((day, j) => {
            const availableHoursForDay = getAvailableHoursForDay(day);
            return (
              <Box key={j} flex={1} px={1}>
                <Box>
                  <Text
                    textAlign={'center'}
                    fontWeight={'semibold'}
                    textTransform={'uppercase'}
                    fontSize={'xs'}
                  >
                    {d(day).format('dddd')}
                  </Text>
                  <Text textAlign={'center'} fontSize={'sm'}>
                    {d(day).format('DD MMMM')}
                  </Text>
                </Box>

                <Box mt={4}>
                  {availableHoursForDay.map((hour, i) => {
                    return (
                      <Button
                        key={i}
                        display={'flex'}
                        variant={'unstyled'}
                        bgColor={'gray.100'}
                        _hover={{ bgColor: 'gray.200' }}
                        w={'full'}
                        h={10}
                        my={2}
                        onClick={() => {
                          setSelectedDayHour({
                            ...hour,
                            date: d(day)
                              .hour(hour.start.split(':')[0])
                              .format('YYYY-MM-DD HH:mm:ss'),
                          });
                        }}
                      >
                        <Text
                          textAlign={'center'}
                        >{`${hour.start.split(':')[0]}:00`}</Text>
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Flex>
      </Box>
      <Box mt={8}>
        {!user ? (
          <>
            <Heading size={'xs'} textAlign={'center'}>
              {t('studio.auth-required')}
            </Heading>
            <Container bg={'white'}>
              <Flex p={4} flexDir={'column'}>
                <Text textAlign={'center'}>{t('auth.new-user')}</Text>
                <Button as={Link} href={`/auth/login`} mt={4}>
                  {t('auth.register')}
                </Button>
              </Flex>
              <Divider />
              <Flex p={4} flexDir={'column'}>
                <Text textAlign={'center'}>{t('auth.already-account')}</Text>
                <Button as={Link} href={`/auth/login`} mt={4}>
                  {t('auth.connect')}
                </Button>
              </Flex>
            </Container>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default ReservationPage;

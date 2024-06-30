import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Heading,
  Link,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useCustomDate from '../hooks/useCustomDate';
import NotFoundPage from './NotFoundPage';
import { CiLocationOn } from 'react-icons/ci';
import { useAuth } from '@/context/AuthContext.jsx';
import WeeksPlanning from '@/components/WeeksPlanning';

const ReservationPage = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const { id, service_id } = useParams();
  const d = useCustomDate();
  const { user, token, authLoading } = useAuth();
  const [studio, setStudio] = useState();
  const [service, setService] = useState();
  const [availableHours, setAvailableHours] = useState({}); // {"2024-06-24": [{"start":"10:00", "end": "11:00", "userId": 46, "fullname": "John Doe"}, {"start":"11:00", "end": "12:00", "userId": 46, "fullname": "John Doe"].....}
  const [selectedDayHour, setSelectedDayHour] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState(); // {"id": 46, "fullname": "John Doe"}
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

  const createReservation = async () => {
    if (!user || !studio || !selectedDayHour || !selectedEmployee) return;
    setIsLoading(true);
    await fetch(import.meta.env.VITE_BACKEND_URL + `/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer: `/api/users/${user.id}`,
        employee: selectedEmployee.id,
        service: service['@id'],
        studio: studio['@id'],
        date: selectedDayHour.date,
      }),
    })
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        toast({
          title: t('studio.reservation-success'),
          description:
            service.name +
            ' - ' +
            d(selectedDayHour.date).format('DD/MM HH:mm'),
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
        console.log(data);
        setSelectedDayHour();
        setSelectedEmployee();
        getAvailableHours();
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
      <Flex flexDir={'column'} mt={8}>
        <Heading size={'sm'}>{t('studio.chosen-date')}</Heading>
        <WeeksPlanning
          availableHours={availableHours}
          selectedDayHour={selectedDayHour}
          setSelectedDayHour={setSelectedDayHour}
        />
        {selectedDayHour && (
          <Heading mt={8} size={'xs'} textAlign={'center'}>
            {t('studio.choose-within-employees')}
          </Heading>
        )}
        <Flex justifyContent={'center'} wrap={'wrap'}>
          {selectedDayHour &&
            selectedDayHour.users.map((employee, i) => {
              return (
                <Card key={i} mx={4}>
                  <CardBody>
                    <Heading size={'xs'} textAlign={'center'}>
                      {employee.fullname}
                    </Heading>
                    <Button
                      onClick={() => setSelectedEmployee(employee)}
                      isDisabled={selectedEmployee?.id === employee.id}
                    >
                      {t('studio.choose-employee')}
                    </Button>
                  </CardBody>
                </Card>
              );
            })}
        </Flex>
      </Flex>
      <Flex mt={8} flexDir={'column'} alignItems={'center'}>
        {!authLoading ? (
          !user ? (
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
            <Flex flexDir={'column'}>
              <Button
                isDisabled={!selectedDayHour || !selectedEmployee}
                onClick={createReservation}
              >
                {t('studio.book')}
              </Button>
              <Link href={`/profile`} mt={4}>
                {t('studio.my-reservations')}
              </Link>
            </Flex>
          )
        ) : (
          <Spinner />
        )}
      </Flex>
    </Box>
  );
};

export default ReservationPage;

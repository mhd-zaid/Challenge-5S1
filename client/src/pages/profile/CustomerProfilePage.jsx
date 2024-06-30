import {
  Box,
  Heading,
  Text,
  Avatar,
  Flex,
  Spinner,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Link,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext.jsx';
import useCustomDate from '@/hooks/useCustomDate.js';
import { FiMoreVertical } from 'react-icons/fi';
import { MdCancel, MdEditCalendar } from 'react-icons/md';
import { CgRedo } from 'react-icons/cg';
import WeeksPlanning from '../../components/WeeksPlanning';
import ManageAccount from '@/components/Modal/ManageAccount.jsx';

const CustomerProfile = ({ user }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const d = useCustomDate();
  const { token } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [selectedDayHour, setSelectedDayHour] = useState();
  const [editing, setEditing] = useState(); // editing reservation id || undefined
  const [availableHours, setAvailableHours] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = async () => {
    await fetch(import.meta.env.VITE_BACKEND_URL + `/reservations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/ld+json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        setReservations(data['hydra:member']);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const getStatusBadge = status => {
    switch (status) {
      case 'RESERVED':
        return <Badge colorScheme="blue">{t('profile.reserved')}</Badge>;
      case 'COMPLETED':
        return <Badge colorScheme="green">{t('profile.completed')}</Badge>;
      case 'CANCELED':
        return <Badge colorScheme="red">{t('profile.cancelled')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const updateReservation = async (id, data) => {
    await fetch(import.meta.env.VITE_BACKEND_URL + `/reservations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        console.log(data);
        getReservations();
        toast({
          title: t('profile.reservation-updated'),
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(err => console.error(err));
  };

  const getAvailableHours = async studioId => {
    setLoading(true);

    await fetch(
      import.meta.env.VITE_BACKEND_URL + `/available_slots/${studioId}`,
    )
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        setAvailableHours(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <Box pt="80px" minH="100vh">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        mb={6}
      >
        <Box>
          <Avatar
            size="xl"
            name={`${user.firstname} ${user.lastname}`}
            src="https://bit.ly/broken-link"
            mb={4}
          />
          <Heading as="h1" size="xl" mb={2}>
            {user.firstname} {user.lastname}
          </Heading>

          <Text fontSize="lg" color="gray.600">
            {user.email}
          </Text>
          <ManageAccount />
        </Box>
      </Flex>
      <Box p={4} bg="white" shadow="md" borderRadius="md">
        <Heading as="h2" size="md" mb={2}>
          {t('profile.booking-history')}
        </Heading>
        <Table mt={4}>
          <Thead>
            <Tr>
              <Th>Service</Th>
              <Th>Studio</Th>
              <Th textAlign={'center'}>Date</Th>
              <Th>Employee</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {!loading ? (
              reservations.length === 0 ? (
                <Tr>
                  <Td colSpan={6}>
                    <Text textAlign={'center'}>
                      {t('profile.no-reservations')}
                    </Text>
                  </Td>
                </Tr>
              ) : (
                reservations.map(reservation => (
                  <Tr key={reservation['@id']}>
                    <Td>
                      <Text>{reservation.service.name}</Text>
                    </Td>
                    <Td>
                      <Text>{reservation.studio.name}</Text>
                    </Td>
                    <Td>
                      <Text textAlign={'center'}>
                        {d(reservation.date).format('DD/MM/YYYY')}
                      </Text>
                      <Text fontWeight={'medium'} textAlign={'center'}>
                        {d.utc(reservation.date).format('HH:mm')}
                      </Text>
                    </Td>
                    <Td>
                      <Text>{reservation.employee.firstname}</Text>
                    </Td>
                    <Td>
                      <Text>{getStatusBadge(reservation.status)}</Text>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreVertical />}
                          variant="unstyled"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<MdEditCalendar size={16} />}
                            hidden={reservation.status === 'CANCELED'}
                            onClick={() => {
                              const studioId = reservation.studio['@id']
                                .split('/')
                                .slice(-1);
                              setEditing(reservation['@id']);
                              getAvailableHours(studioId);
                            }}
                          >
                            Modifier la date ou heure
                          </MenuItem>
                          <MenuItem
                            as={Link}
                            icon={<CgRedo size={16} />}
                            href={`/studios/${reservation.studio['@id'].split('/').slice(-1)}/reservation/${reservation['@id'].split('/').slice(-1)}`}
                          >
                            Réserver à nouveau
                          </MenuItem>
                          <MenuItem
                            icon={<MdCancel size={16} />}
                            color="red"
                            onClick={() => {
                              updateReservation(
                                reservation['@id'].split('/').slice(-1),
                                { status: 'CANCELED' },
                              );
                            }}
                            hidden={reservation.status === 'CANCELED'}
                          >
                            Annuler
                          </MenuItem>
                          <Text
                            mt={2}
                            textAlign={'center'}
                            color={'gray'}
                            fontSize={'xs'}
                          >
                            Dernière mise à jour:&nbsp;
                            {d(reservation.updatedAt).format(
                              'DD/MM/YYYY HH:mm',
                            )}
                          </Text>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))
              )
            ) : (
              <Tr>
                <Td colSpan={6}>
                  <Flex justify="center">
                    <Spinner />
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      {editing && (
        <Box mt={8}>
          <Heading size={'sm'}>
            Modifier votre date de réservation -&nbsp;
            {reservations.find(r => r['@id'] === editing).service.name} -&nbsp;
            {d(reservations.find(r => r['@id'] === editing).date).format(
              'DD/MM/YYYY HH:mm',
            )}
          </Heading>
          <WeeksPlanning
            availableHours={availableHours}
            selectedDayHour={selectedDayHour}
            setSelectedDayHour={setSelectedDayHour}
            isUpdate
          />
          <Flex mt={8} justifyContent={'center'} gap={4}>
            <Button
              onClick={() => {
                updateReservation(editing.split('/').slice(-1), {
                  date: selectedDayHour.date,
                });
                setEditing();
                setSelectedDayHour();
                setAvailableHours({});
              }}
            >
              {t('profile.change-booking')}
            </Button>
            <Button
              variant={'outline'}
              onClick={() => {
                setEditing();
                setSelectedDayHour();
                setAvailableHours({});
              }}
            >
              {t('profile.cancel-change')}
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default CustomerProfile;

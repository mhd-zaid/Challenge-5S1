import React, { useEffect, useState } from 'react';
import {
  Box, Spinner, useToast, IconButton, Table, Thead, Tbody, Tr, Th, Td, Button,
  Icon, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { RepeatIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons';
import PlanningService from '../services/planningService';
import CompanyService from '../services/CompanyService';
import { useAuth } from '../context/AuthContext';
import FilterCalendar from '../components/FilterCalendar';
import EventModalCalendar from '../components/Modal/EventModalCalendar';
import Calendar from '../components/Calendar';
import useCustomDate from '../hooks/useCustomDate';
import ReservationService from '../services/ReservationService';

const CalendarPage = () => {
  const { token, user } = useAuth();
  const [plannings, setPlannings] = useState([]);
  const [users, setUsers] = useState([]);
  const [studios, setStudios] = useState([]);
  const [selectedFilterStudio, setSelectedFilterStudio] = useState('');
  const [selectedFilterUser, setSelectedFilterUser] = useState('');
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const toast = useToast();

  const dayjs = useCustomDate();
  const cancelRef = React.useRef();

  const get_plannings = async () => {
    setIsLoading(true);
    try {
      const response = await PlanningService.get_plannings(token);
      const data = await response.json();
      const workHours = data['hydra:member'].filter(planning => planning.type === 'workHour').map(planning => {
        return {
          start: planning.start.split('+')[0],
          end: planning.end.split('+')[0],
          backgroundColor: planning.hasUnavailabilityHours ? 'red' : 'green',
          borderColor: planning.hasUnavailabilityHours ? 'red' : 'green',
          extendedProps: {
            employeeFullName: `${planning.employee.firstname} ${planning.employee.lastname}`,
            studioName: `${planning.studio.name}`,
            studioAdress: `${planning.studio.address}`,
            startTime: planning.start.split('T')[1].split('+')[0],
            endTime: planning.end.split('T')[1].split('+')[0],
            type: planning.type,
            eventId: planning.idEvent,
            employee: planning.employee['@id'],
            studio: planning.studio['@id'],
          }
        };
      });
      const reservations = data['hydra:member'].filter(planning => planning.type === 'reservation');
      setReservations(reservations);
      setPlannings(workHours);
    } catch (error) {
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger les plannings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const get_company_detail = async () => {
    setIsLoading(true);
    try {
      const response = await CompanyService.get_company_detail(token, user.company.id);
      const data = await response.json();
      setUsers(data.users['hydra:member']);
      setStudios(data.studios['hydra:member']);
    } catch (error) {
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger les détails de la compagnie',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAction = (type, reservationId) => {
    setActionType(type);
    setSelectedReservationId(reservationId);
    setIsConfirmOpen(true);
  };

  const handleCancelReservation = async () => {
    setIsProcessing(true);
    try {
      await PlanningService.update_reservation(token, selectedReservationId, 'CANCELED');
      toast({
        title: 'Réservation annulée',
        description: 'La réservation a été annulée avec succès',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      get_plannings();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'annuler la réservation',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
      setIsConfirmOpen(false);
    }
  };

  const handleCompleteReservation = async () => {
    setIsProcessing(true);
    try {
      await PlanningService.update_reservation(token, selectedReservationId, 'COMPLETED');
      toast({
        title: 'Réservation complété',
        description: 'La réservation a été complété avec succès',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      get_plannings();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de compléter la réservation',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
      setIsConfirmOpen(false);
    }
  };

  const replaceReservation = async (reservation) => {
    const reservationDate = dayjs.utc(reservation.date).format('YYYY-MM-DD');
    const reservationTime = dayjs.utc(reservation.date).format('HH:mm');
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/available_slots/${reservation.studio['@id'].split('/')[3]}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch available slots');
        }

        const data = await response.json();
        const availableSlots = data[reservationDate];

        const slotsAtTime = availableSlots.filter(slot => slot.start === reservationTime);

        if (slotsAtTime.length > 0) {
            const usersAvailable = slotsAtTime.reduce((acc, slot) => {
                slot.users.forEach(user => {
                    acc.add({
                        id: user.id,
                        name: `${user.fullname}`
                    });
                });
                return acc;
            }, new Set());

            console.log('Utilisateurs disponibles :', Array.from(usersAvailable));

            const updateReservation = await ReservationService.replace_reservation(token, {
                id: reservation.id,
                employee: Array.from(usersAvailable)[0].id,
            });

            console.log("ICI")

            if (updateReservation.ok) {
                toast({
                    title: 'Réservation remplacée',
                    description: 'La réservation a été remplacée avec succès',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                get_plannings();
            } else {
                toast({
                    title: 'Erreur',
                    description: 'Impossible de remplacer la réservation',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: 'Aucun créneau disponible',
                description: 'Aucun créneau n\'est disponible pour remplacer cette réservation',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }

    } catch (error) {
      console.error('An error occurred during replacing a reservation:', error);
        toast({
            title: 'Erreur',
            description: 'Impossible de remplacer la réservation',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
  };

  useEffect(() => {
    get_plannings();
    get_company_detail();
  }, []);

  const filteredPlannings = plannings.filter(planning =>
    (!selectedFilterStudio || planning.extendedProps.studio === selectedFilterStudio) &&
    (!selectedFilterUser || planning.extendedProps.employee === selectedFilterUser)
  );

  return (
    <Box pt="4" bg="white" color="black" py="4" px="6" width="100%">
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
    <>
    {user.roles.includes('ROLE_PRESTA') && (
      <FilterCalendar
        studios={studios}
        users={users}
        selectedFilterStudio={selectedFilterStudio}
        setSelectedFilterStudio={setSelectedFilterStudio}
        selectedFilterUser={selectedFilterUser}
        setSelectedFilterUser={setSelectedFilterUser}
      />
    )}
    <IconButton
      onClick={get_plannings}
      icon={<RepeatIcon />}
      aria-label="Recharger le planning"
      mb={4}
    />
    <Calendar
      user={user}
      plannings={filteredPlannings}
      setEvent={setEvent}
      get_plannings={get_plannings}
    />
    <Table variant="simple" mt={4}>
      <Thead>
        <Tr>
          <Th>Nom du client</Th>
          <Th>Nom de l'employé</Th>
          <Th>Studio</Th>
          <Th>Date</Th>
          <Th>Healthy</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {reservations.map(reservation => (
          <Tr key={reservation.id}>
            <Td>{`${reservation.customer.firstname} ${reservation.customer.lastname}`}</Td>
            <Td>{`${reservation.employee.firstname} ${reservation.employee.lastname}`}</Td>
            <Td>{`${reservation.studio.name}`}</Td>
            <Td>{dayjs.utc(reservation.date).format('YYYY-MM-DD HH:mm:ss')}</Td>
            <Td>
              {reservation.healthy ? (
                <CheckIcon color="green.500" />
              ) : (
                <CloseIcon color="red.500" />
              )}
            </Td>
            <Td>
            <Box display="flex" alignItems="center">
            <IconButton
              aria-label="Annuler"
              icon={<CloseIcon />}
              onClick={() => confirmAction('cancel', reservation.id)}
              mr={4} 
            />
            <IconButton
              aria-label="Compléter"
              icon={<CheckIcon />}
              onClick={() => confirmAction('complete', reservation.id)}
              mr={4}
            />
            {!reservation.healthy && (
                <IconButton
                  onClick={() => replaceReservation(reservation)}
                  icon={<RepeatIcon />}
                  aria-label="Essayer de remplacer la réservation"
                />
            )}
          </Box>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
        </>
      )}
      <EventModalCalendar
        isOpen={!!event}
        onClose={() => setEvent(null)}
        event={event}
        setEvent={setEvent}
        token={token}
        users={users}
        studios={studios}
        get_plannings={get_plannings}
        toast={toast}
      />
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {actionType === 'cancel' ? 'Annuler la réservation' : 'Compléter la réservation'}
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir {actionType === 'cancel' ? 'annuler' : 'compléter'} cette réservation ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={actionType === 'cancel' ? handleCancelReservation : handleCompleteReservation} ml={3} isLoading={isProcessing}>
                Confirmer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CalendarPage;

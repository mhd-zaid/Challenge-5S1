import React, { useEffect, useState } from 'react';
import {
  Box, Spinner, useToast, IconButton, Table, Thead, Tbody, Tr, Th, Td, Button,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import PlanningService from '../services/planningService';
import CompanyService from '../services/CompanyService';
import { useAuth } from '../context/AuthContext';
import FilterCalendar from '../components/FilterCalendar';
import EventModalCalendar from '../components/Modal/EventModalCalendar';
import Calendar from '../components/Calendar';

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
  const toast = useToast();

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

  const handleCancelReservation = async (reservationId) => {
    try {
      // Assuming PlanningService has a method for canceling reservations
      await PlanningService.cancel_reservation(token, reservationId);
      toast({
        title: 'Réservation annulée',
        description: 'La réservation a été annulée avec succès',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      get_plannings();  // Refresh the plannings to update the reservations list
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'annuler la réservation',
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
                  <Td>{new Date(reservation.date).toLocaleString()}</Td>
                  <Td>{reservation.healthy ? 'Yes' : 'No'}</Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Annuler
                    </Button>
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
    </Box>
  );
};

export default CalendarPage;

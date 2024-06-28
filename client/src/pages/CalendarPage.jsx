import React, { useEffect, useState } from 'react';
import { Box, background, border, useToast } from '@chakra-ui/react';
import dayjs from 'dayjs';
import PlanningService from '../services/planningService';
import CompanyService from '../services/CompanyService';
import { useAuth } from '../context/AuthContext';
import WorkHourService from '../services/WorkHourService';
import FilterCalendar from '../components/FilterCalendar';
import EventModalCalendar from '../components/Modal/EventModalCalendar';
import Calendar from '../components/Calendar';

const CalendarPage = () => {
  const { token, user } = useAuth();
  const [plannings, setPlannings] = useState([]);
  const [users, setUsers] = useState([]);
  const [studios, setStudios] = useState([]);
  const [selectedFilterStudio, setSelectedFilterStudio] = useState('');
  const [event, setEvent] = useState(null);
  const toast = useToast();

  const get_plannings = async () => {
    await PlanningService.get_plannings(token).then(response => response.json())
      .then(data => {
        console.log(data['hydra:member'])
        const mappedData = data['hydra:member'].map(planning => {
          return {
            start: planning.start.split('+')[0],
            end: planning.end.split('+')[0],
            backgroundColor: planning.hasUnavailabilityHours ? 'red' : 'green',
            borderColor: planning.hasUnavailabilityHours ? 'red' : 'green',
            extendedProps: {
              employeeFullName: `${planning.employee.firstname} ${planning.employee.lastname}`,
              studioName: `${planning.studio.name}`,
              startTime: planning.start.split('T')[1].split('+')[0],
              endTime: planning.end.split('T')[1].split('+')[0],
              type: planning.type,
              eventId: planning.idEvent,
              employee: planning.employee['@id'],
              studio: planning.studio['@id'],
            }
          };
          })
        setPlannings(mappedData);
      });
  };

  const get_company_detail = async () => {
    await CompanyService.get_company_detail(token, user.company.id).then(response => response.json()).then(data => {
      setUsers(data.users['hydra:member']);
      setStudios(data.studios['hydra:member']);
    });
  };

  useEffect(() => {
    get_plannings();
    get_company_detail();
  }, []);

  const filteredPlannings = selectedFilterStudio
    ? plannings.filter(planning => planning.extendedProps.studio === selectedFilterStudio)
    : plannings;

  return (
    <Box pt="4" bg="white" color="black" py="4" px="6" width="100%">
      <h1>Calendar</h1>
      {user.roles.includes('ROLE_PRESTA') && (
        <FilterCalendar studios={studios} selectedFilterStudio={selectedFilterStudio} setSelectedFilterStudio={setSelectedFilterStudio} />
      )}
      <Calendar
        user={user}
        plannings={filteredPlannings}
        setEvent={setEvent}
        get_plannings={get_plannings}
      />
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

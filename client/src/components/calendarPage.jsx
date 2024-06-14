import React, { useEffect, useState } from 'react';
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import PlanningService from '../services/planningService';
import CompanyService from '../services/CompanyService';
import { useAuth } from '../context/AuthContext';
import WorkHourService from '../services/WorkHourService';
import frLocale from '@fullcalendar/core/locales/fr';

const CalendarPage = () => {
  const { token, user } = useAuth();
  const [plannings, setPlannings] = useState([]);
  const [users, setUsers] = useState([]);
  const [studios, setStudios] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedStudio, setSelectedStudio] = useState('');
  const [day, setDay] = useState('');
  const [event, setEvent] = useState(null)

  const toast = useToast();

  const handleSubmit = async() => {

    if(event) {
      await WorkHourService.update_work_hour(token, event.extendedProps.eventId, {
        startTime: `${day}T${startTime}`,
        endTime: `${day}T${endTime}`,
        employee: selectedUser,
        studio: selectedStudio,
      }).then(response => {
        if(response.status === 200) {
          toast({
            title: 'Work hour updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'An error occurred',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }).then(() => {
        get_plannings();
        onClose();
      }
      );
    }else{
      const formData = {
        startTime: `${day}T${startTime}`,
        endTime: `${day}T${endTime}`,
        employee: selectedUser,
        studio: selectedStudio,
      };
  
      await WorkHourService.create_work_hour(token, formData).then(response => {
        if(response.status === 201) {
          toast({
            title: 'Work hour created successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'An error occurred',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }).then(() => {
        get_plannings();
        onClose();
      });
    }
  };

  const get_plannings = async () => {
    await PlanningService.get_plannings(token).then(response => response.json())
    .then(data => {
      const mappedData = data['hydra:member'].map((planning) => {
        return {
          start: planning.start.split('+')[0],
          end: planning.end.split('+')[0],
          extendedProps: {
            employeeFullName : `${planning.employee.firstname} ${planning.employee.lastname}`,
            studioName: `${planning.studio.name}`,
            startTime: planning.start.split('T')[1].split('+')[0],
            endTime: planning.end.split('T')[1].split('+')[0],
            type: planning.type,
            eventId: planning.idEvent,
            employee: planning.employee['@id'],
            studio: planning.studio['@id'],
        }
      };
      });
      setPlannings(mappedData);
    }
    );
  }

  const get_company_detail = async () => {
    await CompanyService.get_company_detail(token, user.company.split('/')[3]).then(response => response.json()).then(data => {
      setUsers(data.users['hydra:member']);
      setStudios(data.studios['hydra:member']);
    });
  }

  useEffect(() => {
    get_plannings();
    get_company_detail();
  }
  , []);

  const handleDeleteEvent = async() => {
    await WorkHourService.delete_work_hour(token, event.extendedProps.eventId).then(response => {
      if(response.status === 204) {
        toast({
          title: 'Work hour deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }).then(() => {
      get_plannings();
    })

    onClose();
  }

  function renderEventContent(eventInfo) {
    return (
      <>
        {eventInfo.event.extendedProps.type === 'workHour' ? (
        <b>Heures de travails</b>
        ) : (
          <b>Absences</b>
        )}
        <p>{eventInfo.event.extendedProps.employeeFullName}</p>
        <p>{eventInfo.event.extendedProps.studioName}</p>
        <p>{eventInfo.event.extendedProps.startTime} - {eventInfo.event.extendedProps.endTime}</p>
      </>
    )
  }

  const handleEventClick = (clickInfo) => {
    setEvent(clickInfo.event);
    setDay(clickInfo.event.startStr.split('T')[0]);
    setStartTime(clickInfo.event.extendedProps.startTime);
    setEndTime(clickInfo.event.extendedProps.endTime);
    setSelectedUser(clickInfo.event.extendedProps.employee);
    setSelectedStudio(clickInfo.event.extendedProps.studio);
    onOpen();
  };

  function handleDateSelect(selectInfo) {
    setEndTime('');
    setStartTime('');
    setSelectedUser('');
    setSelectedStudio('');
    setEvent(null);

    const date = dayjs(selectInfo.dateStr);
    const formattedDate = date.format('YYYY-MM-DD');
    setDay(formattedDate);
    onOpen();
  }

  return (
    <>
    <Box pt="4" bg="white" color="black" py="4" px="6" width="60%">
        <h1>Calendar</h1>
        <FullCalendar
      locales={[frLocale]}
      plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        eventClick={handleEventClick}
        eventContent={renderEventContent} 
        dateClick={handleDateSelect}
        selectMirror={true}
        dayMaxEvents={true}
        initialView="timeGridWeek"
        events={plannings}
        />
    </Box>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Work Hour</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Heure de début</FormLabel>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Sélectionnez l'heure de début"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Heure de fin</FormLabel>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="Sélectionnez l'heure de fin"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Utilisateur</FormLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              placeholder="Sélectionnez un utilisateur"
            >
              {users.map((user) => (
                <option key={user.id} value={user['@id']}>
                  {user.lastname} {user.firstname}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Studio</FormLabel>
            <Select
              value={selectedStudio}
              onChange={(e) => setSelectedStudio(e.target.value)}
              placeholder="Sélectionnez un studio"
            >
              {studios.map((studio) => (
                <option key={studio.id} value={studio['@id']}>
                  {studio.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handleSubmit}>
            {startTime && endTime && selectedUser && selectedStudio ? 'Modifier' : 'Créer'}
          </Button>
          { startTime && endTime && selectedUser && selectedStudio && (
            <Box ml="4">
            <Button onClick={handleDeleteEvent}>
            Supprimer
          </Button>
          </Box>
          )
          }
        </ModalFooter>
      </ModalContent>
    </Modal>


    </>
  );
};

export default CalendarPage;

import React, { useEffect, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button,
  FormControl, FormLabel, Input, Select, Box, Text
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import WorkHourService from '../../services/WorkHourService';
import { useAuth } from '../../context/AuthContext';

const EventModalCalendar = ({ isOpen, onClose, event, setEvent, token, users, studios, get_plannings, toast }) => {
  const { register, handleSubmit, setValue, reset, getValues, watch, formState: { errors } } = useForm();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const selectedStudio = watch('studio');
  const isEmployee = user.roles.includes('ROLE_EMPLOYEE');

  useEffect(() => {
    if (event && event.startStr) {
      setValue('day', event.startStr.split('T')[0]);
      setValue('startTime', event.extendedProps.startTime);
      setValue('endTime', event.extendedProps.endTime);
      setValue('employee', event.extendedProps.employee);
      setValue('studio', event.extendedProps.studio);
    } else {
      reset(); 
    }
  }, [event, setValue, reset]);

  const studioOpeningTimes = studios?.find(studio => studio['@id'] === selectedStudio)?.studioOpeningTimes?.find(time => time.day === new Date(event?.start).getDay());

  let hoursOpeningTime = 'Studio fermé ce jour-là';

  if (studioOpeningTimes) {
      const startTime = studioOpeningTimes.startTime.split('T')[1].slice(0, 5);
      const endTime = studioOpeningTimes.endTime.split('T')[1].slice(0, 5);

      if (startTime !== '00:00' || endTime !== '00:00') {
          hoursOpeningTime = `Ouvert de ${startTime} à ${endTime}`;
      }
  }
  const onSubmit = async (data) => {
    setIsLoading(true);
    const startDay = event && event.startStr ? getValues('day') : event.start.split('T')[0] ;
    const formData = {
      startTime: `${startDay}T${data.startTime}`,
      endTime: `${startDay}T${data.endTime}`,
      employee: data.employee,
      studio: data.studio,
    };

    const studio = studios?.find(studio => studio['@id'] === data.studio);
    const dayOfWeek = new Date(startDay).getDay();
    const openingTime = studio?.studioOpeningTimes?.find(time => time.day === dayOfWeek);

    if (!openingTime) {
      toast({
        title: 'Studio fermé ce jour-là',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    const openingStartTime = openingTime.startTime.split('T')[1].slice(0, 5);
    const openingEndTime = openingTime.endTime.split('T')[1].slice(0, 5);

    if (data.startTime < `${openingStartTime}:00` || data.endTime > `${openingEndTime}:00`) {
      toast({
        title: `Les heures doivent être comprises entre ${openingStartTime} et ${openingEndTime}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    if (event?.extendedProps?.eventId) {
      await WorkHourService.update_work_hour(token, event.extendedProps.eventId, formData)
        .then(async (response) => {
          const res = await response.json()
          if (response.status === 200) {
            toast({
              title: 'Work hour updated successfully',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          } else if(response.status === 422) {
            toast({
              title: res['hydra:description'],
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
          else {
            toast({
              title: 'An error occurred',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        }).then(get_plannings).then(onClose);
    } else {
      await WorkHourService.create_work_hour(token, formData)
        .then(async (response) => {
          const res = await response.json()
          if (response.status === 201) {
            toast({
              title: 'Work hour created successfully',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          }else if(response.status === 422) {
            toast({
              title: res['hydra:description'],
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
           else {
            toast({
              title: 'An error occurred',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        }).then(get_plannings).then(onClose);
    }
    setIsLoading(false);
  };

  const handleDeleteEvent = async () => {
    setIsLoading(true);
    await WorkHourService.delete_work_hour(token, event.extendedProps.eventId).then(response => {
      if (response.status === 204) {
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
    }).then(get_plannings);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {event?.start && new Date(event.start).toLocaleDateString()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!isEmployee && (
              <>
                <FormControl mb={4} isInvalid={errors.startTime}>
                  <FormLabel>Heure de début</FormLabel>
                  <Input
                    type="time"
                    {...register('startTime', { required: 'Heure de début est requise' })}
                  />
                  {errors.startTime && <p>{errors.startTime.message}</p>}
                </FormControl>
                <FormControl mb={4} isInvalid={errors.endTime}>
                  <FormLabel>Heure de fin</FormLabel>
                  <Input
                    type="time"
                    {...register('endTime', {
                      required: 'Heure de fin est requise',
                      validate: (value) => {
                        const startTime = getValues('startTime');
                        if (startTime && value <= startTime) {
                          return "L'heure de fin doit être après l'heure de début";
                        }
                      }
                    })}
                  />
                  {errors.endTime && <p>{errors.endTime.message}</p>}
                </FormControl>
                <FormControl mb={4} isInvalid={errors.employee}>
                  <FormLabel>Utilisateur</FormLabel>
                  <Select
                    {...register('employee', { required: 'Utilisateur est requis' })}
                    placeholder="Sélectionnez un utilisateur"
                  >
                    {users?.map((user) => (
                      <option key={user['@id']} value={user['@id']}>
                        {user.lastname} {user.firstname}
                      </option>
                    ))}
                  </Select>
                  {errors.employee && <p>{errors.employee.message}</p>}
                </FormControl>
                <FormControl mb={4} isInvalid={errors.studio}>
                  <FormLabel>Studio</FormLabel>
                  <Select
                    {...register('studio', { required: 'Studio est requis' })}
                    placeholder="Sélectionnez un studio"
                  >
                    {studios?.map((studio) => (
                      <option key={studio.id} value={studio['@id']}>
                        {studio.name}
                      </option>
                    ))}
                  </Select>
                  {selectedStudio && (
                    <Text>
                      {hoursOpeningTime}
                    </Text>
                  )}
                  {errors.studio && <p>{errors.studio.message}</p>}
                </FormControl>
              </>
            )}
            {isEmployee && (
              <>
                <Box mb={4}>
                  <Text>Date : {event?.start && new Date(event.start).toLocaleDateString()}</Text>
                </Box>
                <Box mb={4}>
                  <Text>Heure de début : {event?.extendedProps.startTime}</Text>
                </Box>
                <Box mb={4}>
                  <Text>Heure de fin : {event?.extendedProps.endTime}</Text>
                </Box>
                <Box mb={4}>
                  <Text>Studio : {event?.extendedProps.studioName}</Text>
                </Box>
                <Box mb={4}>
                  <Text> Address : {event?.extendedProps.studioAdress}</Text>
                </Box>
              </>
            )}
            <ModalFooter>
              <Button mr={3} onClick={onClose} isDisabled={isLoading}>
                Fermer
              </Button>
              {!isEmployee && (
                <Button type="submit" isLoading={isLoading}>
                  {event?.extendedProps?.eventId ? 'Modifier' : 'Créer'}
                </Button>
              )}
              {event?.extendedProps?.eventId && !isEmployee && (
                <Box ml="4">
                  <Button onClick={handleDeleteEvent} isLoading={isLoading}>
                    Supprimer
                  </Button>
                </Box>
              )}
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EventModalCalendar;

import React, { useEffect, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button,
  FormControl, FormLabel, Input, Select, Box, Text
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import WorkHourService from '../../services/WorkHourService';

const EventModalCalendar = ({ isOpen, onClose, event, setEvent, token, users, studios, get_plannings, toast }) => {
  const { register, handleSubmit, setValue, reset, getValues, watch, formState: { errors } } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const selectedStudio = watch('studio');

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

  // const hoursOpeningTime = studio.studioOpeningTimes.map(time => ({ startTime: time.startTime.split('T')[1].slice(0, 5), endTime: time.endTime.split('T')[1].slice(0, 5) }));

  const studioOpeningTimes = studios.find(studio => studio['@id'] === selectedStudio)?.studioOpeningTimes.find(time => time.day === new Date(event?.start).getDay());
  const hoursOpeningTime = studioOpeningTimes ? `Ouvert de ${studioOpeningTimes.startTime.split('T')[1].slice(0, 5)} à ${studioOpeningTimes.endTime.split('T')[1].slice(0, 5)}` : 'Studio fermé ce jour-là';
  const onSubmit = async (data) => {
    setIsLoading(true);
    const startDay = event && event.startStr ? getValues('day') : event.start.split('T')[0] ;
    const formData = {
      startTime: `${startDay}T${data.startTime}`,
      endTime: `${startDay}T${data.endTime}`,
      employee: data.employee,
      studio: data.studio,
    };

    const studio = studios.find(studio => studio['@id'] === data.studio);
    const dayOfWeek = new Date(startDay).getDay();
    const openingTime = studio.studioOpeningTimes.find(time => time.day === dayOfWeek);

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

    if (data.startTime < openingStartTime || data.endTime > openingEndTime) {
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
        .then(response => {
          if (response.status === 200) {
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
        }).then(get_plannings).then(onClose);
    } else {
      await WorkHourService.create_work_hour(token, formData)
        .then(response => {
          if (response.status === 201) {
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
          {event?.start}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                {users.map((user) => (
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
                {studios.map((studio) => (
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
            <ModalFooter>
              <Button mr={3} onClick={onClose} isDisabled={isLoading}>
                Fermer
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {event?.extendedProps?.eventId ? 'Modifier' : 'Créer'}
              </Button>
              {event?.extendedProps?.eventId && (
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

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormControl, FormLabel, Input, Button, Select, Spinner, FormErrorMessage } from '@chakra-ui/react';
import dayjs from 'dayjs';

const NewUnavailabilityHourForm = ({ onSubmit, users, user }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError, clearErrors } = useForm();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const onSubmitForm = async (formData) => {
    if (dayjs(formData.startDate).isAfter(dayjs(formData.endDate))) {
      setError('endDate', { type: 'manual', message: 'La date de fin doit être après la date de début' });
      return;
    }
    
    setIsSubmittingForm(true);

    const formValues = {
      startTime: formData.startDate,
      endTime: formData.endDate,
      employee: user.roles.includes('ROLE_PRESTA') ? formData.selectedUser : `/api/users/${user.id}`,
      status: user.roles.includes('ROLE_PRESTA') ? 'Accepted' : 'Pending',
    };

    await onSubmit(formValues);
    reset();
    setIsSubmittingForm(false);
    clearErrors();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <FormControl mb="4" isInvalid={errors.startDate}>
        <FormLabel>Début de l'absence</FormLabel>
        <Input
          type="date"
          {...register('startDate', { required: 'La date de début est requise' })}
          placeholder="Select start date"
        />
        <FormErrorMessage>
          {errors.startDate && errors.startDate.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl mb="4" isInvalid={errors.endDate}>
        <FormLabel>Fin de l'absence</FormLabel>
        <Input
          type="date"
          {...register('endDate', { required: 'La date de fin est requise' })}
          placeholder="Select end date"
        />
        <FormErrorMessage>
          {errors.endDate && errors.endDate.message}
        </FormErrorMessage>
      </FormControl>

      {user.roles.includes('ROLE_PRESTA') && (
        <FormControl mb="4" isInvalid={errors.selectedUser}>
          <FormLabel>Utilisateur</FormLabel>
          <Select
            {...register('selectedUser', { required: 'L\'utilisateur est requis' })}
            placeholder="Sélectionnez un utilisateur"
          >
            {users?.map((user) => (
              <option key={user['@id']} value={user['@id']}>
                {user.lastname} {user.firstname}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.selectedUser && errors.selectedUser.message}
          </FormErrorMessage>
        </FormControl>
      )}

      <Button colorScheme="teal" type="submit" isDisabled={isSubmitting || isSubmittingForm}>
        {isSubmittingForm ? <Spinner size="sm" /> : 'Soumettre'}
      </Button>
    </form>
  );
};

export default NewUnavailabilityHourForm;

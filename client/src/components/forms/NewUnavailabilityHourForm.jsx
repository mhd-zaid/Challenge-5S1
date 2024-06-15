import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Button, Select, Spinner, Box  } from '@chakra-ui/react';
import dayjs from 'dayjs';

const NewUnavailabilityHourForm = ({ onSubmit, users, user }) => {

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {

    setIsSubmitting(true);

    const formData = {
      startTime: startDate,
      endTime: endDate,
      employee: user.roles.includes('ROLE_PRESTA') ? selectedUser : `/api/users/${user.id}`,
      status: user.roles.includes('ROLE_PRESTA') ? 'Accepted' : 'Pending',
    };
   await onSubmit(formData);

   setStartDate('');
   setEndDate('');
   setSelectedUser('');
   setIsSubmitting(false);
  };

  return (
    <>
      <FormControl mb="4">
        <FormLabel>Début de l'absence</FormLabel>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Select start date"
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Fin de l'absence</FormLabel>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Select end date"
        />
      </FormControl>
      {user.roles.includes('ROLE_PRESTA') && (
        <FormControl mb="4">
          <FormLabel>Utilisateur</FormLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            placeholder="Sélectionnez un utilisateur"
          >
            {users.map((user) => (
              <option key={user['@id']} value={user['@id']}>
                {user.lastname} {user.firstname}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
      <Button colorScheme="teal" onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? <Spinner size="sm" /> : 'Soumettre'}
      </Button>
    </>
  );
};

export default NewUnavailabilityHourForm;

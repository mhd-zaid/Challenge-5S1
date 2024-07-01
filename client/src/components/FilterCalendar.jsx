import React from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';

const FilterCalendar = ({ studios, users, selectedFilterStudio, setSelectedFilterStudio, selectedFilterUser, setSelectedFilterUser }) => (
  <div>
    <FormControl mb={4}>
      <FormLabel>Filtrer par studio</FormLabel>
      <Select
        value={selectedFilterStudio}
        onChange={(e) => setSelectedFilterStudio(e.target.value)}
        placeholder="Sélectionnez un studio"
      >
        {studios?.map((studio) => (
          <option key={studio.id} value={studio['@id']}>
            {studio.name}
          </option>
        ))}
      </Select>
    </FormControl>

    <FormControl mb={4}>
      <FormLabel>Filtrer par utilisateur</FormLabel>
      <Select
        value={selectedFilterUser}
        onChange={(e) => setSelectedFilterUser(e.target.value)}
        placeholder="Sélectionnez un utilisateur"
      >
        {users?.map((user) => (
          <option key={user.id} value={user['@id']}>
            {user.firstname} {user.lastname}
          </option>
        ))}
      </Select>
    </FormControl>
  </div>
);

export default FilterCalendar;

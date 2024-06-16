import React from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';

const FilterCalendar = ({ studios, selectedFilterStudio, setSelectedFilterStudio }) => (
  <FormControl mb={4}>
    <FormLabel>Filtrer par studio</FormLabel>
    <Select
      value={selectedFilterStudio}
      onChange={(e) => setSelectedFilterStudio(e.target.value)}
      placeholder="Sélectionnez un studio"
    >
      {studios.map((studio) => (
        <option key={studio.id} value={studio['@id']}>
          {studio.name}
        </option>
      ))}
    </Select>
  </FormControl>
);

export default FilterCalendar;

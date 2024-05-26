import React, { useState,useEffect } from 'react';
import { Box,Flex, Select, Button, Stack,Input  } from '@chakra-ui/react';

const SearchBar = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/services/distinct/name', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setServices(data['hydra:member']);
    };

    fetchServices();
  }, []);

  const handleSearch = () => {
    console.log('Selected Service:', selectedService);
    console.log('City:', city);
  };

  return (
    <Box bg="white" color="black" py="4" px="6" width="60%">
      <Flex justifyContent="center" alignItems="center">
        <Stack direction="row" spacing={4} width="100%" maxWidth="1000px">
            <Select
              placeholder="Que cherchez-vous ?"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          <Input
            placeholder='Choisissez une Ville'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button
            bg="black"
            color="white"
            w='30%'
            onClick={handleSearch}
          >
            Rechercher
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default SearchBar;

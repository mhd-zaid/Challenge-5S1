import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Select,
  Button,
  Stack,
  Input,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/services/distinct/name',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      setServices(data['hydra:member']);
    };

    fetchServices();
  }, []);

  const fetchCitySuggestions = async query => {
    if (query.length > 0) {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${query}&fields=nom&boost=population&limit=5`,
      );
      const data = await response.json();
      setCitySuggestions(data);
    } else {
      setCitySuggestions([]);
    }
  };

  const handleCityChange = e => {
    const query = e.target.value;
    setCity(query);
    fetchCitySuggestions(query);
  };

  const handleSearch = () => {
    let url = 'studio';
    if (selectedService && city) {
      url += `?service=${selectedService}&city=${city}`;
    } else if (selectedService) {
      url += `?service=${selectedService}`;
    } else if (city) {
      url += `?city=${city}`;
    }
    navigate(url, {
      state: { city: city, service: selectedService },
    });
  };

  return (
    <Box bg="white" color="black" py="4" px="6" width="60%">
      <Flex justifyContent="center" alignItems="center">
        <Stack direction="row" spacing={4} width="100%" maxWidth="1000px">
          <Select
            placeholder="Que cherchez-vous ?"
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
          >
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
          <Box position="relative" width="100%">
            <Input
              placeholder="Choisissez une Ville"
              value={city}
              onChange={handleCityChange}
            />
            {citySuggestions.length > 0 && (
              <List
                position="absolute"
                bg="white"
                border="1px solid #e2e8f0"
                borderRadius="md"
                width="100%"
                maxHeight="200px"
                overflowY="auto"
                zIndex="10"
              >
                {citySuggestions.map(suggestion => (
                  <ListItem
                    key={suggestion.nom}
                    padding="4"
                    cursor="pointer"
                    onClick={() => {
                      setCity(suggestion.nom);
                      setCitySuggestions([]);
                    }}
                  >
                    {suggestion.nom}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
          <Button bg="black" color="white" w="30%" onClick={handleSearch}>
            Rechercher
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default SearchBar;

import React from 'react';
import {
  Box,
  Heading,
  Text,
  Avatar,
  Stack,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = ({user}) => {
  const navigate = useNavigate();

  return (
    <Box
      pt="80px"
      minH="100vh"
    >
      <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" mb={6}>
        <Box>
          <Avatar
            size="xl"
            name={`${user.firstname} ${user.lastname}`}
            src="https://bit.ly/broken-link"
            mb={4}
          />
          <Heading as="h1" size="xl" mb={2}>
            {user.firstname} {user.lastname}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {user.email}
          </Text>
        </Box>
      </Flex>
      <Stack spacing={4}>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>
            Informations générales
          </Heading>
          <Text>Nom: {user.firstname} {user.lastname}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Téléphone: {user.phone}</Text>
        </Box>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>
            Historique des réservations
          </Heading>
          <Text>25 juin 2024 - Studio A réservé de 10h00 à 12h00</Text>
          <Text>30 juin 2024 - Studio B réservé de 14h00 à 16h00</Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default CustomerProfile;

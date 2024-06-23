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

const EmployeeProfile = ({user}) => {

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
            Horaire de travail
          </Heading>
          <Text>Lundi - Vendredi: 9h00 - 17h00</Text>
          <Text>Samedi: 9h00 - 13h00</Text>
        </Box>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>
            Indisponibilités
          </Heading>
          <Text>Indisponible le 25 juin 2024 (Congés)</Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default EmployeeProfile;

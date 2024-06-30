import {
  Box,
  Heading,
  Text,
  Avatar,
  Stack,
  Flex,
  Modal,
} from '@chakra-ui/react';
import CalendarPage from '@/pages/CalendarPage.jsx';
import Unavailability from '@/pages/Unavailability.jsx';
import ManageAccount from '../../components/Modal/ManageAccount';
import LineChart from '../../components/LineChart';

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
          <ManageAccount />
        </Box>
      </Flex>
      <Stack spacing={4}>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <LineChart />
        </Box>
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
            Planning
          </Heading>
          <Flex justifyContent={"center"}>
            <CalendarPage />
          </Flex>
        </Box>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>
            Indisponibilités
          </Heading>
          <Flex justifyContent={"center"}>
            <Unavailability />
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};

export default EmployeeProfile;

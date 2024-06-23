import {
  Box,
  Heading,
  Text,
  Avatar,
  Stack,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const PrestaProfile = ({user}) => {

  return (
    <Box
      maxW="7xl"
      mx="auto"
      p={6}
      pt="80px" // Ajout de padding-top pour éviter que la navbar masque le contenu
      bg={useColorModeValue('gray.100', 'gray.900')}
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
            Société
          </Heading>
          {user.company && (
            <>
              <Text>Société : {user.company.name}</Text>
              <Text>Ville : {user.company.city}</Text>
              {user.company.socialMedia && (
              <Text>Réseau social : {user.company.socialMedia}</Text>
              )}
              {user.company.website && (
              <Text>Site web : {user.company.website}</Text>
              )}
              <Text>Email : {user.company.email}</Text>
              <Text>Tel : {user.company.phone}</Text>
            </>
          )}
        </Box>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>
            Etablissement(s)
          </Heading>
          {user.company && user.company.studios && user.company.studios.length > 0 && (
            user.company.studios.map((studio, index) => (
              <Box key={index} p={4} bg="gray.200" shadow="md" borderRadius="md" mb={4}>
                <Heading as={RouterLink} textDecoration={"underline"} size="sm" mb={2}>
                  {studio.name}
                </Heading>
                <Text>Adresse : {studio.address}</Text>
                <Text>Ville : {studio.city}</Text>
                <Text>Code postal : {studio.zipCode}</Text>
                <Text>Pays : {studio.country}</Text>
                <Text>Tel : {studio.phone}</Text>
              </Box>
            ))
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default PrestaProfile;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Avatar,
  Stack,
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import ManageAccount from '@/components/Modal/ManageAccount.jsx';

const AdminProfile = ({user}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEditProfile = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSaveChanges = () => {
    setIsOpen(false);
  };

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
        <Button colorScheme="blue" onClick={handleEditProfile}>
          Modifier le profil
        </Button>
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
            Rôles et permissions
          </Heading>
          <Text>Rôle: Administrateur</Text>
          <Text>Permissions:
            Gérer les établissements,
            Gérer les studios,
            Gérer les utilisateurs,
            Voir les statistiques</Text>
        </Box>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>
            Activité récente
          </Heading>
          <Text>Dernière connexion: 21 juin 2024</Text>
          <Text>Actions récentes: Modification des permissions d'un utilisateur, Validation d'un établissement</Text>
        </Box>
      </Stack>

      {/* Modal de modification du profil */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier le profil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Input type="text" placeholder="Nom" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Email" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Téléphone</FormLabel>
              <Input type="tel" placeholder="Téléphone" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveChanges}>
              Sauvegarder
            </Button>
            <Button onClick={handleClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminProfile;

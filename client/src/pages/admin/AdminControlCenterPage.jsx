import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
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
import axios from 'axios';
import Pagination from '@/components/Pagination.jsx';
import { useAuth } from '@/context/AuthContext.jsx';

const AdminControlCenterPage = () => {
  const { user, token } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editData, setEditData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [studios, setStudios] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataType, setDataType] = useState('companies');
  const roleNames = {
    'ROLE_ADMIN': 'Administrateur',
    'ROLE_PRESTA': 'Prestataire',
    'ROLE_EMPLOYEE': 'Employé',
    'ROLE_CUSTOMER': 'Client',
  };

  useEffect(() => {
    fetchData(dataType, currentPage);
  }, [dataType, currentPage]);

  const fetchData = async (type, page) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${type}?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    const data = await response.json();
    if (type === 'companies') {
      setCompanies(data['hydra:member']);
    } else if (type === 'studios') {
      setStudios(data['hydra:member']);
    } else if (type === 'users') {
      setUsers(data['hydra:member']);
    }
    const view = data['hydra:view'];
    if (view) {
      const match = view['hydra:last'].match(/page=(\d+)/);
      if (match) {
        setTotalPages(Number(match[1]));
      }
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    onOpen();
  };

  const handleAdd = () => {
    setEditData(null);
    onOpen();
  };

  const handleSave = () => {
    // Logique de sauvegarde
    onClose();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Control Center</Heading>
      <Tabs onChange={(index) => setDataType(['companies', 'studios', 'users'][index])}>
        <TabList>
          <Tab>Compagnies</Tab>
          <Tab>Studios</Tab>
          <Tab>Utilisateurs</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Button mb={4} onClick={handleAdd}>Ajouter une compagnie</Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nom</Th>
                  <Th>Email</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {companies && companies.map((company) => (
                  <Tr key={company.id}>
                    <Td>{company.name}</Td>
                    <Td>{company.email}</Td>
                    <Td>
                      <Button colorScheme="blue" onClick={() => handleEdit(company)}>Modifier</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </TabPanel>

          <TabPanel>
            <Button mb={4} onClick={handleAdd}>Ajouter un studio</Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nom</Th>
                  <Th>Adresse</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {studios.map((studio) => (
                  <Tr key={studio.id}>
                    <Td>{studio.name}</Td>
                    <Td>{studio.address}</Td>
                    <Td>
                      <Button colorScheme="blue" onClick={() => handleEdit(studio)}>Modifier</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </TabPanel>

          <TabPanel>
            <Button mb={4} onClick={handleAdd}>Ajouter un utilisateur</Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nom</Th>
                  <Th>Email</Th>
                  <Th>Rôle</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.filter((person) => user.id !== person.id).map((person) => (
                  <Tr key={person.id}>
                    <Td>{person.firstname} {person.lastname}</Td>
                    <Td>{person.email}</Td>
                    <Td>{roleNames[person.roles[0]]}</Td>
                    <Td>
                      <Button colorScheme="blue" onClick={() => handleEdit(person)}>Modifier</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editData ? 'Modifier' : 'Ajouter'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Nom</FormLabel>
              <Input placeholder="Nom" defaultValue={editData?.name} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input placeholder="Email" defaultValue={editData?.email} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Enregistrer
            </Button>
            <Button variant="outline" onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminControlCenterPage;

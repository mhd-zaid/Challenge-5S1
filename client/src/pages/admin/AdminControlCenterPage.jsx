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
  Flex, MenuItem, Menu, MenuButton, MenuList,
} from '@chakra-ui/react';
import Pagination from '@/components/Pagination.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { Icon } from '@iconify/react';
import FormCompany from '@/components/forms/FormCompany.jsx';
import FormStudio from '@/components/forms/FormStudio.jsx';
import FormUser from '@/components/forms/FormUser.jsx';
import FormCompanyRequest from '@/components/forms/FormCompanyRequest.jsx';
import { apiService } from '@/services/apiService.js';

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
    const response = await apiService.getAll(token, type, page)
    const data = await response.json();

    if (type === 'companies') {
      setCompanies(data['hydra:member'].map((company) => ({
        ...company,
        createdAt: new Date(company.createdAt).toLocaleDateString(),
      })))
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
    } else {
      setTotalPages(1);
    }
  };

  const handleFormSubmit = async (hasBeenUpdate) => {
    if (hasBeenUpdate) {
      await fetchData(dataType, currentPage);
    } else {
      onClose();
    }
  };

  const handleView = (data) => {
    // if(dataType === 'companies') {
    //   CompanyService.get_company_detail(token, data.id).then(response => response.json()).then(data => {
    //     setEditData(data);
    //     onOpen();
    //   });
    // }
    setEditData(data);
    onOpen();
  }

  const handleAdd = () => {
    setEditData(null);
    onOpen();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box px={4} py={24} maxW={"7xl"} mx={"auto"}>
      <Heading mb={4}>Centre de contrôle administratif</Heading>
      <Tabs onChange={(index) => setDataType(['companies', 'studios', 'users'][index])}>
        <TabList>
          <Tab>Compagnies</Tab>
          <Tab>Studios</Tab>
          <Tab>Utilisateurs</Tab>
        </TabList>

        <TabPanels>
          {/*Gestion des compagnies*/}
          <TabPanel>
            <Button mb={4} onClick={handleAdd}>Ajouter une compagnie</Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nom</Th>
                  <Th>Email</Th>
                  <Th>Téléphone</Th>
                  <Th>Vérifié</Th>
                  <Th>Date d'inscription</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {companies && companies.map((company) => (
                  <Tr key={company.id}>
                    <Td>{company.name}</Td>
                    <Td>{company.email}</Td>
                    <Td>{company.phone}</Td>
                    <Td>
                      <Flex justifyContent={"center"}>
                        {company.isVerified ? (
                          <Icon icon="lets-icons:check-fill" fontSize={30} style={{color: "green"}} />
                        ) : (
                          <Icon icon="gridicons:cross-circle" fontSize={30} style={{color: "red"}} />
                        )}
                      </Flex>
                    </Td>
                    <Td>{company.createdAt}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Flex} bg={"transparent"} cursor={"pointer"}>
                          <Icon icon="system-uicons:menu-vertical" fontSize={30} style={{color: "black"}} />
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => handleView(company)}>Voir les informations de la compagnie</MenuItem>
                          <MenuItem onClick={() => handleView(company)}>Modifier les informations du propriétaire</MenuItem>
                          <MenuItem onClick={() => handleView(company)}>Modifier le propriétaire</MenuItem>
                          <MenuItem onClick={() => handleView(company)}>Désactiver la compagnie</MenuItem>
                          <MenuItem onClick={() => handleDelete(company)}>Supprimer</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </TabPanel>

          {/*Gestion des studios*/}
          <TabPanel>
            <Button mb={4} onClick={handleAdd}>Ajouter un studio</Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Entreprise</Th>
                  <Th>Studio</Th>
                  <Th>Adresse</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {studios && studios.map((studio) => (
                  <Tr key={studio.id}>
                    <Td>{studio.company.name}</Td>
                    <Td>{studio.name}</Td>
                    <Td>{studio.address}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Flex} bg={"transparent"} cursor={"pointer"}>
                          <Icon icon="system-uicons:menu-vertical" fontSize={30} style={{color: "black"}} />
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => handleView(studio)}>Voir les informations du studio</MenuItem>
                          <MenuItem onClick={() => handleView(studio)}>Désactiver le studio</MenuItem>
                          <MenuItem onClick={() => handleDelete(studio)}>Supprimer</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </TabPanel>

          {/*Gestion des utilisateurs*/}
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
                      <Menu>
                        <MenuButton as={Flex} bg={"transparent"} cursor={"pointer"}>
                          <Icon icon="system-uicons:menu-vertical" fontSize={30} style={{color: "black"}} />
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => handleView(person)}>Voir les informations de l'utilisateur</MenuItem>
                          <MenuItem onClick={() => handleView(person)}>Désactiver l'utilisateur</MenuItem>
                          <MenuItem onClick={() => handleDelete(person)}>Supprimer</MenuItem>
                        </MenuList>
                      </Menu>
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
        <ModalContent maxW={"4xl"}>
          <ModalHeader>{editData ? 'Modifier' : 'Ajouter'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {dataType === 'companies' ? (
              editData ? (
                <FormCompany company={editData} onSubmitForm={handleFormSubmit}/>
              ) : (
                <FormCompanyRequest onSubmitForm={handleFormSubmit}/>
              )
            ) : dataType === 'studios' ? (
              <FormStudio studio={editData}  onSubmitForm={handleFormSubmit}/>
            ) : dataType === 'users' ? (
              <FormUser userr={editData}  onSubmitForm={handleFormSubmit}/>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminControlCenterPage;

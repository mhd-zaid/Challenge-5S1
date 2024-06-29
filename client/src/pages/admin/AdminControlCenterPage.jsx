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
  Flex, MenuItem, Menu, MenuButton, MenuList, Text,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext.jsx';
import { Icon } from '@iconify/react';
import FormCompany from '@/components/forms/FormCompany.jsx';
import FormStudio from '@/components/forms/FormStudio.jsx';
import FormUser from '@/components/forms/FormUser.jsx';
import FormCompanyRequest from '@/components/forms/FormCompanyRequest.jsx';
import { apiService } from '@/services/apiService.js';
import FormStudioOpeningTime from '@/components/forms/FormStudioOpeningTime.jsx';
import useCustomDate from '@/hooks/useCustomDate.js';
import Pagination from '@/components/shared/Pagination';

const AdminControlCenterPage = () => {
  const { user, token, isAdministrator, isPrestataire } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editData, setEditData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [studios, setStudios] = useState([]);
  const [users, setUsers] = useState([]);
  const [studioOpeningTimes, setStudioOpeningTimes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dayjs = useCustomDate();
  const [dataType, setDataType] = useState(isAdministrator ? 'companies' : 'studios');
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const roleNames = {
    'ROLE_ADMIN': 'Administrateur',
    'ROLE_PRESTA': 'Prestataire',
    'ROLE_EMPLOYEE': 'Employé',
    'ROLE_CUSTOMER': 'Client',
  };

  const [paginationStudio, setPaginationStudio] = useState({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  const [paginationUser, setPaginationUser] = useState({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  const [paginationOpeningTime, setPaginationOpeningTime] = useState({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  const [paginationCompany, setPaginationCompany] = useState({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  useEffect(() => {
    if(isAdministrator) {
    fetchData('companies', paginationCompany.page, paginationCompany.itemsPerPage);
    }
  }, [paginationCompany.itemsPerPage, paginationCompany.page]);

  const handlePageChangeCompany = (page) => {
    setPaginationCompany({ ...paginationCompany, page });
  };

  const handleItemsPerPageChangeCompany = (itemsPerPage) => {
    setPaginationCompany({ 
        ...paginationCompany, 
        itemsPerPage,
        page: 1,
      });
  };

  useEffect(() => {
    fetchData('users', paginationUser.page, paginationUser.itemsPerPage);
  }, [paginationUser.itemsPerPage, paginationUser.page]);

  const handlePageChangeUser = (page) => {
    setPaginationUser({ ...paginationUser, page });
  };

  const handleItemsPerPageChangeUser = (itemsPerPage) => {
    setPaginationUser({ 
        ...paginationUser, 
        itemsPerPage,
        page: 1,
      });
  };

  useEffect(() => {
    fetchData('studio_opening_times', paginationOpeningTime.page, paginationOpeningTime.itemsPerPage);
  }, [paginationOpeningTime.itemsPerPage, paginationOpeningTime.page]);

  const handlePageChangeOpeningTimes = (page) => {
    setPaginationOpeningTime({ ...paginationOpeningTime, page });
  };

  const handleItemsPerPageChangeOpeningTimes = (itemsPerPage) => {
    setPaginationOpeningTime({ 
        ...paginationOpeningTime, 
        itemsPerPage,
        page: 1,
      });
  };

  useEffect(() => {
    fetchData('studios', paginationStudio.page, paginationStudio.itemsPerPage);
  }, [paginationStudio.itemsPerPage, paginationStudio.page]);

  const handlePageChangeStudio = (page) => {
    setPaginationStudio({ ...paginationStudio, page });
  };

  const handleItemsPerPageChangeStudio = (itemsPerPage) => {
    setPaginationStudio({ 
        ...paginationStudio, 
        itemsPerPage,
        page: 1,
      });
  };


  // useEffect(() => {
  //   fetchData(dataType, currentPage);
  // }, [dataType, currentPage]);

  const fetchData = async (type, page, itemsPerPage) => {
    const response = await apiService.getAll(token, type, page, itemsPerPage);
    const data = await response.json();

    if (type === 'companies') {
      setCompanies(data['hydra:member'].map((company) => ({
        ...company,
        createdAt: new Date(company.createdAt).toLocaleDateString(),
      })))
      setPaginationCompany({
        ...paginationCompany,
        totalItems: data['hydra:totalItems'],
      });
    } else if (type === 'studios') {
      setStudios(data['hydra:member']);
      setPaginationStudio({
        ...paginationStudio,
        totalItems: data['hydra:totalItems'],
      });
    } else if (type === 'users') {
      setUsers(data['hydra:member']);
      setPaginationUser({
        ...paginationUser,
        totalItems: data['hydra:totalItems'],
      });
    } else if (type === 'studio_opening_times') {
      setStudioOpeningTimes(data['hydra:member'].map(
        (studioOpeningTime) => ({
          ...studioOpeningTime,
          startTime: dayjs.utc(studioOpeningTime.startTime),
          endTime: dayjs.utc(studioOpeningTime.endTime),
        })
      ));
      setPaginationOpeningTime({
        ...paginationOpeningTime,
        totalItems: data['hydra:totalItems'],
      })
    }
    // const view = data['hydra:view'];
    // if (view) {
    //   const match = view['hydra:last'].match(/page=(\d+)/);
    //   if (match) {
    //     setTotalPages(Number(match[1]));
    //   }
    // } else {
    //   setTotalPages(1);
    // }
  };

  const handleFormSubmit = async (hasBeenSubmitted) => {
    if (hasBeenSubmitted) {
      await fetchData(dataType, currentPage).then(() => onClose());
    } else {
      onClose();
    }
  };

  const handleView = (data) => {
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
      <Tabs onChange={(index) => setDataType(
        isAdministrator ?
        ['companies', 'studios', 'users'][index] : ['studios', 'users', 'studio_opening_times'][index]
      )}>
        <TabList>
          {isAdministrator && <Tab>Compagnies</Tab>}
          <Tab>Studios</Tab>
          <Tab>Utilisateurs</Tab>
          {isPrestataire && <Tab>Horaires</Tab>}
        </TabList>

        <TabPanels>
          {/*Gestion des compagnies*/}
          {isAdministrator &&
          <TabPanel>
            <Button mb={4} onClick={handleAdd}>Ajouter une compagnie</Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nom</Th>
                  <Th>Email</Th>
                  <Th>Téléphone</Th>
                  <Th>Vérifiée</Th>
                  <Th>Date d'inscription</Th>
                  <Th></Th>
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
                        {!company.isActive ? (
                          <Icon icon="circum:no-waiting-sign" fontSize={30} style={{color: "red"}} />
                        ) : company.isRejected ? (
                          <Icon icon="gridicons:cross-circle" fontSize={30} style={{color: "red"}} />
                        ) : !company.isVerified && !company.isRejected ? (
                          <Icon icon="ic:round-info" fontSize={30} style={{color: "orange"}} />
                        ) : (
                          <Icon icon="lets-icons:check-fill" fontSize={30} style={{color: "green"}} />
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
            <Pagination 
              page={paginationCompany.page}
              itemsPerPage={paginationCompany.itemsPerPage}
              totalItems={paginationCompany.totalItems}
              onPageChange={handlePageChangeCompany}
              onItemsPerPageChange={handleItemsPerPageChangeCompany}
            />
            <Box my={4}>
              <Flex gap={4}>
                <Icon icon="circum:no-waiting-sign" fontSize={30} style={{color: "red"}} />
                <Text>Entreprise Désactive</Text>
              </Flex>
              <Flex gap={4}>
                <Icon icon="gridicons:cross-circle" fontSize={30} style={{color: "red"}} />
                <Text>Entreprise Rejetée</Text>
              </Flex>
              <Flex gap={4}>
                <Icon icon="ic:round-info" fontSize={30} style={{color: "orange"}} />
                <Text>En attente de vérification</Text>
              </Flex>
              <Flex gap={4}>
                <Icon icon="lets-icons:check-fill" fontSize={30} style={{color: "green"}} />
                <Text>Entreprise Vérifiée</Text>
              </Flex>
            </Box>
          </TabPanel>
          }

          {/*Gestion des studios*/}
          <TabPanel>
            <Button mb={4} onClick={handleAdd}>Ajouter un studio</Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Entreprise</Th>
                  <Th>Studio</Th>
                  <Th>Adresse</Th>
                  <Th></Th>
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
            <Pagination 
              page={paginationStudio.page}
              itemsPerPage={paginationStudio.itemsPerPage}
              totalItems={paginationStudio.totalItems}
              onPageChange={handlePageChangeStudio}
              onItemsPerPageChange={handleItemsPerPageChangeStudio}
             />
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
                  <Th></Th>
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
                          <MenuItem onClick={() => handleView(person)}>Modifier l'utilisateur</MenuItem>
                          <MenuItem onClick={() => handleView(person)}>Supprimer l'utilisateur</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination 
              page={paginationUser.page}
              itemsPerPage={paginationUser.itemsPerPage}
              totalItems={paginationUser.totalItems}
              onPageChange={handlePageChangeUser}
              onItemsPerPageChange={handleItemsPerPageChangeUser}
            />
          </TabPanel>

          {/*Horaire d'ouverture*/}
          {isPrestataire &&
            <TabPanel>
            <Button mb={4} onClick={handleAdd}>Ajouter une horaire</Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Studio</Th>
                  <Th>Jour</Th>
                  <Th>H. d'ouverture</Th>
                  <Th>H. de fermeture</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {studioOpeningTimes && studioOpeningTimes.map((studioOpeningTime) => (
                  <Tr key={studioOpeningTime.id}>
                    <Td>{studioOpeningTime.studio?.name}</Td>
                    <Td>{days[studioOpeningTime.day]}</Td>
                    <Td>
                      <Flex justifyContent={"center"} alignItems={"center"}>
                        {dayjs(studioOpeningTime.startTime).format('HH:mm')}
                      </Flex>
                    </Td>
                    <Td>
                      <Flex justifyContent={"center"} alignItems={"center"}>
                        <Text>{dayjs(studioOpeningTime.endTime).format('HH:mm')}</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton as={Flex} bg={"transparent"} cursor={"pointer"}>
                          <Icon icon="system-uicons:menu-vertical" fontSize={30} style={{color: "black"}} />
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => handleView(studioOpeningTime)}>Modifier l'horaire</MenuItem>
                          <MenuItem onClick={() => handleDelete(studioOpeningTime)}>Supprimer</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination 
              page={paginationOpeningTime.page}
              itemsPerPage={paginationOpeningTime.itemsPerPage}
              totalItems={paginationOpeningTime.totalItems}
              onPageChange={handlePageChangeOpeningTimes}
              onItemsPerPageChange={handleItemsPerPageChangeOpeningTimes}
            />
            <Box my={4}>
              <Flex gap={4}>
                <Icon icon="circum:no-waiting-sign" fontSize={30} style={{color: "red"}} />
                <Text>Entreprise Désactive</Text>
              </Flex>
              <Flex gap={4}>
                <Icon icon="gridicons:cross-circle" fontSize={30} style={{color: "red"}} />
                <Text>Entreprise Rejetée</Text>
              </Flex>
              <Flex gap={4}>
                <Icon icon="ic:round-info" fontSize={30} style={{color: "orange"}} />
                <Text>En attente de vérification</Text>
              </Flex>
              <Flex gap={4}>
                <Icon icon="lets-icons:check-fill" fontSize={30} style={{color: "green"}} />
                <Text>Entreprise Vérifiée</Text>
              </Flex>
            </Box>
          </TabPanel>
          }
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
              <FormUser user={editData}  onSubmitForm={handleFormSubmit}/>
            ) : dataType === 'studio_opening_times' ? (
              <FormStudioOpeningTime studioOpeningTime={editData}  onSubmitForm={handleFormSubmit}/>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminControlCenterPage;

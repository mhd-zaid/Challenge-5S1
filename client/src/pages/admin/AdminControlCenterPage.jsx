import { useState, useEffect } from 'react';
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
  Flex,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  useToast,
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
import FormService from '@/components/forms/FormService.jsx';
import { useTranslation } from 'react-i18next';

const AdminControlCenterPage = () => {
  const { t } = useTranslation();

  const { user, token, isAdministrator, isPrestataire } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [editData, setEditData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [studios, setStudios] = useState([]);
  const [users, setUsers] = useState([]);
  const [studioOpeningTimes, setStudioOpeningTimes] = useState([]);
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  let groupedServices = null;
  const dayjs = useCustomDate();
  const [dataType, setDataType] = useState(
    isAdministrator ? 'companies' : 'studios',
  );

  const roleNames = {
    ROLE_ADMIN: 'Administrateur',
    ROLE_PRESTA: 'Prestataire',
    ROLE_EMPLOYEE: 'Employé',
    ROLE_CUSTOMER: 'Client',
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
    itemsPerPage: 1000,
    totalItems: 0,
  });

  const [paginationCompany, setPaginationCompany] = useState({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  const [paginationService, setPaginationService] = useState({
    page: 1,
    itemsPerPage: 1000,
    totalItems: 0,
  });

  useEffect(() => {
    if (isAdministrator) {
      fetchData(
        'companies',
        paginationCompany.page,
        paginationCompany.itemsPerPage,
      );
    }
  }, [paginationCompany.itemsPerPage, paginationCompany.page]);

  const handlePageChangeCompany = page => {
    setPaginationCompany({ ...paginationCompany, page });
  };

  const handleItemsPerPageChangeCompany = itemsPerPage => {
    setPaginationCompany({
      ...paginationCompany,
      itemsPerPage,
      page: 1,
    });
  };

  useEffect(() => {
    if (!isAdministrator) {
      fetchData(
        'services',
        paginationService.page,
        paginationService.itemsPerPage,
      );
    }
  }, []);

  useEffect(() => {
    fetchData('users', paginationUser.page, paginationUser.itemsPerPage);
  }, [paginationUser.itemsPerPage, paginationUser.page]);

  const handlePageChangeUser = page => {
    setPaginationUser({ ...paginationUser, page });
  };

  const handleItemsPerPageChangeUser = itemsPerPage => {
    setPaginationUser({
      ...paginationUser,
      itemsPerPage,
      page: 1,
    });
  };

  useEffect(() => {
    fetchData(
      'studio_opening_times',
      paginationOpeningTime.page,
      paginationOpeningTime.itemsPerPage,
    );
  }, []);

  useEffect(() => {
    fetchData('studios', paginationStudio.page, paginationStudio.itemsPerPage);
  }, [paginationStudio.itemsPerPage, paginationStudio.page]);

  const handlePageChangeStudio = page => {
    setPaginationStudio({ ...paginationStudio, page });
  };

  const handleItemsPerPageChangeStudio = itemsPerPage => {
    setPaginationStudio({
      ...paginationStudio,
      itemsPerPage,
      page: 1,
    });
  };

  const fetchData = async (type, page, itemsPerPage) => {
    const response = await apiService.getAll(token, type, page, itemsPerPage);
    const data = await response.json();

    if (type === 'companies') {
      setCompanies(
        data['hydra:member'].map(company => ({
          ...company,
          createdAt: new Date(company.createdAt).toLocaleDateString(),
        })),
      );
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
      setStudioOpeningTimes(
        transformData(
          data['hydra:member'].map(studioOpeningTime => ({
            ...studioOpeningTime,
            startTime: dayjs.utc(studioOpeningTime.startTime),
            endTime: dayjs.utc(studioOpeningTime.endTime),
          })),
        ),
      );
      setPaginationOpeningTime({
        ...paginationOpeningTime,
        totalItems: data['hydra:totalItems'],
      });
    } else if (type === 'services') {
      setServices(
        data['hydra:member'].map(service => ({
          ...service,
          duration: dayjs.utc(service.duration).format('HH:mm'),
        })),
      );
    }
  };

  const handleFormSubmit = async hasBeenSubmitted => {
    if (hasBeenSubmitted) {
      if (dataType === 'studio_opening_times') {
        await fetchData(dataType, 1, 1000).then(() => onClose());
      } else {
        await fetchData(dataType, currentPage).then(() => onClose());
      }
    } else {
      onClose();
    }
  };

  const handleView = data => {
    setEditData(data);
    onOpen();
  };

  const handleAdd = data => {
    setEditData(data);
    onOpen();
  };

  const handleDelete = async (data, instance) => {
    const confirmAction = confirm(
      'Etes-vous sûr de vouloir supprimer cet élément ?',
    );
    if (!confirmAction) {
      return;
    }

    const type = instance ? instance : dataType;
    await fetch(
      import.meta.env.VITE_BACKEND_URL +
        `/${type}/` +
        data['@id'].split('/')[3],
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    ).then(() => {
      handleFormSubmit(true);
      toast({
        title: `${type} supprimé`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const transformData = data => {
    const result = {};
    data.forEach(item => {
      const studioName = item.studio.name;
      const day = item.day;
      const startTime = dayjs.utc(item.startTime).format('HH:mm');
      const endTime = dayjs.utc(item.endTime).format('HH:mm');
      const studio = item.studio;
      const id = item['@id'];

      if (!result[studioName]) {
        result[studioName] = {
          0: { studio, day: 0 },
          1: { studio, day: 1 },
          2: { studio, day: 2 },
          3: { studio, day: 3 },
          4: { studio, day: 4 },
          5: { studio, day: 5 },
          6: { studio, day: 6 },
        };
      }
      result[studioName][day] = { startTime, endTime, studio, day, '@id': id };
    });

    return result;
  };

  if (services) {
    groupedServices = services.reduce((acc, service) => {
      const studioName = service.studio.name;
      if (!acc[studioName]) {
        acc[studioName] = [];
      }
      acc[studioName].push(service);

      return acc;
    }, {});
  }

  return (
    <Box p={4} maxW={'7xl'} mx={'auto'}>
      <Heading mb={4}>{t('control-center.main-title')}</Heading>
      <Tabs
        onChange={index =>
          setDataType(
            isAdministrator
              ? ['companies', 'studios', 'users'][index]
              : ['studios', 'users', 'studio_opening_times', 'services'][index],
          )
        }
      >
        <TabList>
          {isAdministrator && <Tab>{t('control-center.company')}</Tab>}
          <Tab>Studios</Tab>
          <Tab>{t('control-center.users')}</Tab>
          {isPrestataire && <Tab>{t('control-center.schedules')}</Tab>}
          {isPrestataire && <Tab>Services</Tab>}
        </TabList>

        <TabPanels>
          {/*Gestion des compagnies*/}
          {isAdministrator && (
            <TabPanel>
              <Button mb={4} onClick={() => handleAdd()}>
                {t('control-center.add-company')}
              </Button>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>{t('company.name')}</Th>
                    <Th>Email</Th>
                    <Th>{t('company.phone')}</Th>
                    <Th>Status</Th>
                    <Th>{t('company.register-date')}</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {companies &&
                    companies.map(company => (
                      <Tr key={company.id}>
                        <Td>{company.name}</Td>
                        <Td>{company.email}</Td>
                        <Td>{company.phone}</Td>
                        <Td>
                          <Flex justifyContent={'center'}>
                            {company.status === 'pending' ? (
                              <Icon
                                icon="ic:round-info"
                                fontSize={30}
                                style={{ color: 'orange' }}
                              />
                            ) : company.status === 'accepted' ? (
                              <Icon
                                icon="lets-icons:check-fill"
                                fontSize={30}
                                style={{ color: 'green' }}
                              />
                            ) : company.status === 'refused' ? (
                              <Icon
                                icon="gridicons:cross-circle"
                                fontSize={30}
                                style={{ color: 'red' }}
                              />
                            ) : company.status === 'deleted' ? (
                              <Icon
                                icon="circum:no-waiting-sign"
                                fontSize={30}
                                style={{ color: 'red' }}
                              />
                            ) : null}
                          </Flex>
                        </Td>
                        <Td>{company.createdAt}</Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={Flex}
                              bg={'transparent'}
                              cursor={'pointer'}
                            >
                              <Icon
                                icon="system-uicons:menu-vertical"
                                fontSize={30}
                                style={{ color: 'black' }}
                              />
                            </MenuButton>
                            <MenuList>
                              <MenuItem onClick={() => handleView(company)}>
                                {t('control-center.company-info')}
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleDelete(company.owner, 'users')
                                }
                              >
                                {t('global.delete')}
                              </MenuItem>
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
                <Flex gap={4} alignItems={'center'}>
                  <Icon
                    icon="ic:round-info"
                    fontSize={30}
                    style={{ color: 'orange' }}
                  />
                  <Text>
                    {t('admin.request')}
                    {t('admin.waiting')}
                  </Text>
                </Flex>
                <Flex gap={4} alignItems={'center'}>
                  <Icon
                    icon="lets-icons:check-fill"
                    fontSize={30}
                    style={{ color: 'green' }}
                  />
                  <Text>
                    {t('admin.request')}
                    {t('admin.approved')}
                  </Text>
                </Flex>
                <Flex gap={4} alignItems={'center'}>
                  <Icon
                    icon="gridicons:cross-circle"
                    fontSize={30}
                    style={{ color: 'red' }}
                  />
                  <Text>
                    {t('admin.request')}
                    {t('admin.refused')}
                  </Text>
                </Flex>
                <Flex gap={4} alignItems={'center'}>
                  <Icon
                    icon="circum:no-waiting-sign"
                    fontSize={30}
                    style={{ color: 'red' }}
                  />
                  <Text>
                    {t('control-center.company')}
                    {t('admin.deleted')}
                  </Text>
                </Flex>
              </Box>
            </TabPanel>
          )}

          {/*Gestion des studios*/}
          <TabPanel>
            <Button mb={4} onClick={() => handleAdd()}>
              {t('control-center.add-studio')}
            </Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t('control-center.company')}</Th>
                  <Th>Studio</Th>
                  <Th>{t('company.phone')}</Th>
                  <Th>{t('company.city')}</Th>
                  <Th>{t('company.address')}</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {studios &&
                  studios.map(studio => (
                    <Tr key={studio.id}>
                      <Td>{studio.company.name}</Td>
                      <Td>{studio.name}</Td>
                      <Td>{studio.phone}</Td>
                      <Td>{studio.city}</Td>
                      <Td>{studio.address}</Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Flex}
                            bg={'transparent'}
                            cursor={'pointer'}
                          >
                            <Icon
                              icon="system-uicons:menu-vertical"
                              fontSize={30}
                              style={{ color: 'black' }}
                            />
                          </MenuButton>
                          <MenuList>
                            <MenuItem onClick={() => handleView(studio)}>
                              {t('control-center.studio-info')}
                            </MenuItem>
                            <MenuItem onClick={() => handleDelete(studio)}>
                              {t('global.delete')}
                            </MenuItem>
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
            <Button mb={4} onClick={() => handleAdd()}>
              {t('control-center.add-user')}
            </Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t('control-center.company')}</Th>
                  <Th>{t('company.name')}</Th>
                  <Th>Email</Th>
                  <Th>{t('profile.role')}</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users
                  .filter(person => user.id !== person.id)
                  .map(person => (
                    <Tr key={person.id}>
                      <Td>{person.company?.name}</Td>
                      <Td>
                        {person.firstname} {person.lastname}
                      </Td>
                      <Td>{person.email}</Td>
                      <Td>{roleNames[person.roles[0]]}</Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Flex}
                            bg={'transparent'}
                            cursor={'pointer'}
                          >
                            <Icon
                              icon="system-uicons:menu-vertical"
                              fontSize={30}
                              style={{ color: 'black' }}
                            />
                          </MenuButton>
                          <MenuList>
                            <MenuItem onClick={() => handleView(person)}>
                              {t('control-center.edit-user')}
                            </MenuItem>
                            <MenuItem onClick={() => handleDelete(person)}>
                              {t('control-center.delete-user')}
                            </MenuItem>
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
          {isPrestataire && (
            <TabPanel>
              <Text>{t('control-center.select-schedules')}</Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Studio</Th>
                    <Th>{dayjs().weekday(0).format('dddd')}</Th>
                    <Th>{dayjs().weekday(1).format('dddd')}</Th>
                    <Th>{dayjs().weekday(2).format('dddd')}</Th>
                    <Th>{dayjs().weekday(3).format('dddd')}</Th>
                    <Th>{dayjs().weekday(4).format('dddd')}</Th>
                    <Th>{dayjs().weekday(5).format('dddd')}</Th>
                    <Th>{dayjs().weekday(6).format('dddd')}</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(studioOpeningTimes).map(studio => (
                    <Tr key={studio}>
                      <Td>{studio}</Td>
                      {[1, 2, 3, 4, 5, 6, 0].map((day, index) => (
                        <Td key={day}>
                          <Menu>
                            <MenuButton
                              as={Flex}
                              bg={'transparent'}
                              cursor={'pointer'}
                            >
                              {studioOpeningTimes[studio][day].startTime &&
                              studioOpeningTimes[studio][day].endTime
                                ? `${studioOpeningTimes[studio][day].startTime} - ${studioOpeningTimes[studio][day].endTime}`
                                : `Fermé`}
                            </MenuButton>
                            <MenuList>
                              {studioOpeningTimes[studio][day].startTime &&
                              studioOpeningTimes[studio][day].endTime ? (
                                <>
                                  <MenuItem
                                    onClick={() =>
                                      handleView(
                                        studioOpeningTimes[studio][day],
                                      )
                                    }
                                  >
                                    {t('control-center.edit-schedule')}
                                  </MenuItem>
                                </>
                              ) : (
                                <MenuItem
                                  onClick={() =>
                                    handleAdd(
                                      studioOpeningTimes[studio][
                                        (index + 1) % 7
                                      ],
                                    )
                                  }
                                >
                                  {t('control-center.add-schedule')}
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
          )}

          {/*Services*/}
          {isPrestataire && (
            <TabPanel>
              <Button mb={4} onClick={() => handleAdd()}>
                {t('control-center.add-service')}
              </Button>
              <Accordion allowMultiple>
                {Object.keys(groupedServices).map(studioName => (
                  <AccordionItem key={studioName}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {studioName}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <Table mt={4}>
                        <Thead>
                          <Tr>
                            <Th>{t('control-center.name')}</Th>
                            <Th>{t('control-center.price')}</Th>
                            <Th>{t('control-center.duration')}</Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {groupedServices[studioName].map(service => (
                            <Tr key={service.id}>
                              <Td>{service.name}</Td>
                              <Td>{service.cost} €</Td>
                              <Td>{service.duration}</Td>
                              <Td>
                                <Menu>
                                  <MenuButton
                                    as={Flex}
                                    bg={'transparent'}
                                    cursor={'pointer'}
                                  >
                                    <Icon
                                      icon="system-uicons:menu-vertical"
                                      fontSize={30}
                                      style={{ color: 'black' }}
                                    />
                                  </MenuButton>
                                  <MenuList>
                                    <MenuItem
                                      onClick={() => handleView(service)}
                                    >
                                      {t('control-center.service-info')}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => handleDelete(service)}
                                    >
                                      {t('global.delete')}
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={'4xl'}>
          <ModalHeader>
            {editData
              ? `Modifier ${dataType.slice(0, -1)}`
              : `Ajouter ${dataType.slice(0, -1)}`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {dataType === 'companies' ? (
              editData ? (
                <FormCompany
                  company={editData}
                  onSubmitForm={handleFormSubmit}
                />
              ) : (
                <FormCompanyRequest onSubmitForm={handleFormSubmit} />
              )
            ) : dataType === 'studios' ? (
              <FormStudio studio={editData} onSubmitForm={handleFormSubmit} />
            ) : dataType === 'users' ? (
              <FormUser user={editData} onSubmitForm={handleFormSubmit} />
            ) : dataType === 'studio_opening_times' ? (
              <FormStudioOpeningTime
                studioOpeningTime={editData}
                onSubmitForm={handleFormSubmit}
              />
            ) : dataType === 'services' ? (
              <FormService service={editData} onSubmitForm={handleFormSubmit} />
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminControlCenterPage;

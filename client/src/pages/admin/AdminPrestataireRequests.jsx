import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import { useAuth } from '@/context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

const AdminPrestataireRequests = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [siren, setSiren] = useState('');
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    creationDate: '',
  });
  const [isEditable, setIsEditable] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);

  const fetchCompaniesRequest = async () => {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + '/companies',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/ld+json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    let data = await response.json();
    data = data['hydra:member'].map(request => ({
      ...request,
      createdAt: dayjs(request.createdAt).format('DD/MM/YYYY'),
    }));
    setRequests(data);
  };

  useEffect(() => {
    fetchCompaniesRequest();
  }, [token]);


  const downloadKbis = async (url) => {
    console.log(url);
    await  fetch(import.meta.env.VITE_BACKEND_URL + '/get-kbis/' + url.split(".")[0], {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async response => {
      const file = await response.blob();
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL,
        '_blank',
        'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    })
  };

  useEffect(() => {
    if (isOpen && siren) {
      getCompanyInfo();
    }
  }, [isOpen, siren]);

  const getCompanyInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/info/company/${siren}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setCompanyInfo({
          ...data,
          name: data.denominationUniteLegale,
          sigle: data.sigleUniteLegale,
          creationDate: dayjs(data.dateCreationUniteLegale).format(
            'DD/MM/YYYY',
          ),
        });
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } catch (error) {
      setIsValid(false);
    } finally {
      setIsEditable(false);
      setIsLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCompanyInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSave = () => {
    setIsEditable(false);
    onClose();
  };

  const handleOpenModal = request => {
    setSelectedRequest(request);
    setSiren(request.siren);
    onOpen();
  };

  const handleValidate = async () => {
    if (selectedRequest) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/companies/${selectedRequest.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/merge-patch+json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: 'accepted' }),
          },
        );
        if (response.ok) {
          toast({
            title: 'Demande approuvée.',
            description: 'La demande a été approuvée avec succès.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setRequests(prevRequests =>
            prevRequests.filter(req => req.id !== selectedRequest.id),
          );
        } else {
          toast({
            title: 'Erreur',
            description: "Une erreur est survenue lors de l'approbation.",
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: 'Erreur',
          description: "Une erreur est survenue lors de l'approbation.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        onClose();
        fetchCompaniesRequest();
      }
    }
  };

  const handleRefuse = async () => {
    if (selectedRequest) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/companies/${selectedRequest.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/merge-patch+json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: 'refused' }),
          },
        );
        if (response.ok) {
          toast({
            title: 'Demande refusée.',
            description: 'La demande a été refusée avec succès.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setRequests(prevRequests =>
            prevRequests.filter(req => req.id !== selectedRequest.id),
          );
        } else {
          toast({
            title: 'Erreur',
            description: "Une erreur est survenue lors du refus.",
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: 'Erreur',
          description: "Une erreur est survenue lors du refus.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        onClose();
        fetchCompaniesRequest();
      }
    }
  };

  // Filtrage des demandes approuvées et non approuvées
  const approvedRequests = requests.filter(req => req.status === 'accepted');
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const refusedRequests = requests.filter(req => req.status === 'refused');

  return (
    <Box pt={8} mx={'auto'} maxW={'80%'}>
      <Heading mb={5}>{t('admin.presta-requests-handle')}</Heading>
      <Tabs
        isLazy
        variant="soft-rounded"
        index={tabIndex}
        onChange={index => setTabIndex(index)}
      >
        <TabList>
          <Tab>{t('admin.request')}s</Tab>
          <Tab>
            {t('admin.request')}s{t('admin.waiting')}
          </Tab>
          <Tab>
            {t('admin.request')}s{t('admin.approved')}s
          </Tab>
          <Tab>
            {t('admin.request')}s{t('admin.refused')}s
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={3} spacing={10}>
              {requests.map(request => (
                <Card
                  key={request.id}
                  bg="gray.800"
                  color="white"
                  borderRadius="md"
                  boxShadow="xl"
                >
                  <CardHeader borderBottom="1px" borderColor="gray.700">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Heading size="md">{request.name}</Heading>
                      <Text fontSize="sm" color="gray.400">
                        {t('admin.made-on')} : {request.createdAt}
                      </Text>
                    </Box>
                  </CardHeader>
                  <CardBody>
                    <List spacing={2}>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.address')}:{' '}
                        </Text>
                        {request.address || 'N/A'}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          Email:{' '}
                        </Text>
                        {request.email}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.phone')}:{' '}
                        </Text>
                        {request.phone}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.website')}:{' '}
                        </Text>
                        {request.website || 'N/A'}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          Kbis:
                        </Text>
                        <Text as="span"> Cliquez </Text>
                        <Link
                          as="span"
                          textDecoration="underline"
                          color="teal.300"
                          onClick={() => downloadKbis(request.kbis.filePath)}
                        >
                          ici
                        </Link>
                        <Text as="span"> pour consulter le fichier</Text>
                      </ListItem>
                    </List>
                  </CardBody>
                  <CardFooter display="flex" justifyContent="flex-end">
                    {request.status === 'pending' ? (
                      <Button
                        variant="solid"
                        colorScheme="green"
                        onClick={() => handleOpenModal(request)}
                      >
                        {t('admin.verify')}
                      </Button>
                    ) : request.status === 'accepted' ? (
                      <Flex justifyContent={'center'} alignItems={'center'}>
                        <Icon
                          icon="icon-park-solid:check-one"
                          style={{ color: 'green' }}
                        />
                        <Text ml={2} color="green.500">
                          {t('admin.request')}
                          {t('admin.approved')}.
                        </Text>
                      </Flex>
                    ) : (
                      <Flex justifyContent={'center'} alignItems={'center'}>
                        <Icon
                          icon="mdi:alert-circle"
                          style={{ color: '#ff0000' }}
                        />
                        <Text ml={2} color="red.500">
                          {t('admin.request')}
                          {t('admin.refused')}.
                        </Text>
                      </Flex>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={3} spacing={10}>
              {pendingRequests.map(request => (
                <Card
                  key={request.id}
                  bg="gray.800"
                  color="white"
                  borderRadius="md"
                  boxShadow="xl"
                >
                  <CardHeader borderBottom="1px" borderColor="gray.700">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Heading size="md">{request.name}</Heading>
                      <Text fontSize="sm" color="gray.400">
                        {t('admin.made-on')} : {request.createdAt}
                      </Text>
                    </Box>
                  </CardHeader>
                  <CardBody>
                    <List spacing={2}>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.address')}:{' '}
                        </Text>
                        {request.address || 'N/A'}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          Email:{' '}
                        </Text>
                        {request.email}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.phone')}:{' '}
                        </Text>
                        {request.phone}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.website')}:{' '}
                        </Text>
                        {request.website || 'N/A'}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          Kbis:
                        </Text>
                        <Text as="span"> Cliquez </Text>
                        <Link
                          as="span"
                          textDecoration="underline"
                          color="teal.300"
                          onClick={() => downloadKbis(request.kbis.filePath)}
                        >
                          ici
                        </Link>
                        <Text as="span"> pour consulter le fichier</Text>
                      </ListItem>
                    </List>
                  </CardBody>
                  <CardFooter display="flex" justifyContent="flex-end">
                    <Button
                      variant="solid"
                      colorScheme="green"
                      onClick={() => handleOpenModal(request)}
                    >
                      {t('admin.verify')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={3} spacing={10}>
              {approvedRequests.map(request => (
                <Card
                  key={request.id}
                  bg="gray.800"
                  color="white"
                  borderRadius="md"
                  boxShadow="xl"
                >
                  <CardHeader borderBottom="1px" borderColor="gray.700">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Heading size="md">{request.name}</Heading>
                      <Text fontSize="sm" color="gray.400">
                        {t('admin.made-on')} : {request.createdAt}
                      </Text>
                    </Box>
                  </CardHeader>
                  <CardBody>
                    <List spacing={2}>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.address')}:{' '}
                        </Text>
                        {request.address || 'N/A'}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          Email:{' '}
                        </Text>
                        {request.email}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.phone')}:{' '}
                        </Text>
                        {request.phone}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.website')}:{' '}
                        </Text>
                        {request.website || 'N/A'}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          Kbis:
                        </Text>
                        <Text as="span"> Cliquez </Text>
                        <Link
                          as="span"
                          textDecoration="underline"
                          color="teal.300"
                          onClick={() => downloadKbis(request.kbis.filePath)}
                        >
                          ici
                        </Link>
                        <Text as="span"> pour consulter le fichier</Text>
                      </ListItem>
                    </List>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={3} spacing={10}>
              {refusedRequests.map(request => (
                <Card
                  key={request.id}
                  bg="gray.800"
                  color="white"
                  borderRadius="md"
                  boxShadow="xl"
                >
                  <CardHeader borderBottom="1px" borderColor="gray.700">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Heading size="md">{request.name}</Heading>
                      <Text fontSize="sm" color="gray.400">
                        {t('admin.made-on')} : {request.createdAt}
                      </Text>
                    </Box>
                  </CardHeader>
                  <CardBody>
                    <List spacing={2}>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.address')}:{' '}
                        </Text>
                        {request.address || 'N/A'}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          Email:{' '}
                        </Text>
                        {request.email}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.phone')}:{' '}
                        </Text>
                        {request.phone}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          {t('company.website')}:{' '}
                        </Text>
                        {request.website || 'N/A'}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">
                          Kbis:
                        </Text>
                        <Text as="span"> Cliquez </Text>
                        <Link
                          as="span"
                          textDecoration="underline"
                          color="teal.300"
                          onClick={() => downloadKbis(request.kbis.contentUrl)}
                        >
                          ici
                        </Link>
                        <Text as="span"> pour consulter le fichier</Text>
                      </ListItem>
                    </List>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('company.info')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
              >
                <Spinner size="xl" />
              </Box>
            ) : (
              <>
                {isValid === true ? (
                  <>
                    <Box display="flex" alignItems="center" color="green.500">
                      <Icon
                        icon="icon-park-solid:check-one"
                        style={{ color: 'green' }}
                      />
                      <Text ml={2}>{t('admin.valid-info')}</Text>
                    </Box>
                    <FormControl id="siren" mt={4}>
                      <FormLabel>SIREN</FormLabel>
                      {isEditable ? (
                        <Input value={siren} isReadOnly />
                      ) : (
                        <Text>{siren}</Text>
                      )}
                    </FormControl>
                    <FormControl id="name" mt={4}>
                      <FormLabel>{t('company.name')}</FormLabel>
                      {isEditable ? (
                        <Input
                          name="name"
                          value={companyInfo.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <>
                          <Text>{companyInfo.name}</Text>
                          <Text>{companyInfo.sigle}</Text>
                        </>
                      )}
                    </FormControl>
                    <FormControl id="creationDate" mt={4}>
                      <FormLabel>{t('company.creation-date')}</FormLabel>
                      {isEditable ? (
                        <Input
                          name="creationDate"
                          value={companyInfo.creationDate}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <Text>{companyInfo.creationDate}</Text>
                      )}
                    </FormControl>
                  </>
                ) : (
                  <Box display="flex" alignItems="center" color="red.500">
                    <Icon
                      icon="mdi:alert-circle"
                      style={{ color: '#ff0000' }}
                    />
                    <Text ml={2}>{t('admin.invalid-info')}</Text>
                  </Box>
                )}
              </>
            )}
          </ModalBody>

          <ModalFooter>
            {isValid && isEditable ? (
              <>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={handleSave}
                  isDisabled={isLoading}
                >
                  {t('global.save')}
                </Button>
                <Button variant="outline" onClick={() => setIsEditable(false)}>
                  {t('global.cancel')}
                </Button>
              </>
            ) : isValid ? (
              <>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => setIsEditable(true)}
                >
                  {t('admin.modify')}
                </Button>
                <Button colorScheme="green" mr={3} onClick={handleValidate}>
                  {t('admin.approve')}
                </Button>
                <Button variant="outline" mr={3} onClick={handleRefuse}>
                  {t('admin.refuse')}
                </Button>
              </>
            ) : isValid === false ? (
              <Button variant="outline" mr={3} onClick={handleRefuse}>
                {t('admin.refuse')}
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminPrestataireRequests;

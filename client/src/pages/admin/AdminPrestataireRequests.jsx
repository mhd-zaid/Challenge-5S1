import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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

const AdminPrestataireRequests = () => {
  const { token } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [siren, setSiren] = useState('');
  const [companyInfo, setCompanyInfo] = useState({ name: '', creationDate: '' });
  const [isEditable, setIsEditable] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0); // Etat pour gérer l'onglet actif

  const fetchCompaniesRequest = async () => {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/companies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    let data = await response.json();
    data = data['hydra:member'].map((request) => ({
      ...request,
      createdAt: dayjs(request.createdAt).format('DD/MM/YYYY'),
    }));
    setRequests(data);
  };

  useEffect(() => {
    fetchCompaniesRequest();
  }, [token]);

  const downloadKbis = (url) => {
    window.open(import.meta.env.VITE_BACKEND_BASE_URL + url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  };

  useEffect(() => {
    if (isOpen && siren) {
      getCompanyInfo();
    }
  }, [isOpen, siren]);

  const getCompanyInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/info/company/${siren}`);
      const data = await response.json();
      if (response.ok) {
        setCompanyInfo({
          ...data,
          name: data.denominationUniteLegale,
          sigle: data.sigleUniteLegale,
          creationDate: dayjs(data.dateCreationUniteLegale).format('DD/MM/YYYY'),
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSave = () => {
    setIsEditable(false);
    onClose();
  };

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setSiren(request.siren);
    onOpen();
  };

  const handleValidate = async () => {
    if (selectedRequest) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/companies/${selectedRequest.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ isVerified: true }),
        });
        if (response.ok) {
          toast({
            title: "Demande approuvée.",
            description: "La demande a été approuvée avec succès.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setRequests((prevRequests) => prevRequests.filter((req) => req.id !== selectedRequest.id));
        } else {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'approbation.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'approbation.",
          status: "error",
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/companies/${selectedRequest.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          toast({
            title: "Demande refusée.",
            description: "La demande a été refusée avec succès.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setRequests((prevRequests) => prevRequests.filter((req) => req.id !== selectedRequest.id));
        } else {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors du refus.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du refus.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        fetchCompaniesRequest();
        onClose();
      }
    }
  };

  // Filtrage des demandes approuvées et non approuvées
  const approvedRequests = requests.filter(req => req.isVerified && !req.isRejected && req.isActive);
  const waitingRequests = requests.filter(req => !req.isVerified && !req.isRejected && req.isActive);
  const rejectedRequests = requests.filter(req => req.isRejected);
  const disabledRequests = requests.filter(req => !req.isActive);

  return (
    <Box py={24} mx={"auto"} maxW={"80%"}>
      <Heading mb={5}>Gestion des demandes de prestataires</Heading>
      <Tabs isLazy variant="soft-rounded" index={tabIndex} onChange={index => setTabIndex(index)}>
        <TabList>
          <Tab>Demandes en attente</Tab>
          <Tab>Etablissements approuvées</Tab>
          <Tab>Etablissements refusées</Tab>
          <Tab>Etablissements désactivés</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={3} spacing={10}>
              {waitingRequests.map((request) => (
                <Card key={request.id} bg="gray.800" color="white" borderRadius="md" boxShadow="xl">
                  <CardHeader borderBottom="1px" borderColor="gray.700">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Heading size="md">{request.name}</Heading>
                      <Text fontSize="sm" color="gray.400">Fait le : {request.createdAt}</Text>
                    </Box>
                  </CardHeader>
                  <CardBody>
                    <List spacing={2}>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Adresse: </Text>
                        {request.address || "N/A"}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Email: </Text>
                        {request.email}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Téléphone: </Text>
                        {request.phone}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Site web: </Text>
                        {request.website || "N/A"}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Kbis:</Text>
                        <Text as="span"> Cliquez </Text>
                        <Link as="span" textDecoration="underline" color="teal.300" onClick={() => downloadKbis(request.kbis.contentUrl)}>ici</Link>
                        <Text as="span"> pour consulter le fichier</Text>
                      </ListItem>
                    </List>
                  </CardBody>
                  <CardFooter display="flex" justifyContent="flex-end" >
                    <Button variant="solid" colorScheme="green" onClick={() => handleOpenModal(request)}>Vérifier</Button>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={3} spacing={10}>
              {approvedRequests.map((request) => (
                <Card key={request.id} bg="gray.800" color="white" borderRadius="md" boxShadow="xl">
                  <CardHeader borderBottom="1px" borderColor="gray.700">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Heading size="md">{request.name}</Heading>
                      <Text fontSize="sm" color="gray.400">Fait le : {request.createdAt}</Text>
                    </Box>
                  </CardHeader>
                  <CardBody>
                    <List spacing={2}>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Adresse: </Text>
                        {request.address || "N/A"}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Email: </Text>
                        {request.email}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Téléphone: </Text>
                        {request.phone}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Site web: </Text>
                        {request.website || "N/A"}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Kbis:</Text>
                        <Text as="span"> Cliquez </Text>
                        <Link as="span" textDecoration="underline" color="teal.300" onClick={() => downloadKbis(request.kbis.contentUrl)}>ici</Link>
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
              {rejectedRequests.map((request) => (
                <Card key={request.id} bg="gray.800" color="white" borderRadius="md" boxShadow="xl">
                  <CardHeader borderBottom="1px" borderColor="gray.700">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Heading size="md">{request.name}</Heading>
                      <Text fontSize="sm" color="gray.400">Fait le : {request.createdAt}</Text>
                    </Box>
                  </CardHeader>
                  <CardBody>
                    <List spacing={2}>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Adresse: </Text>
                        {request.address || "N/A"}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Email: </Text>
                        {request.email}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Téléphone: </Text>
                        {request.phone}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Site web: </Text>
                        {request.website || "N/A"}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Kbis:</Text>
                        <Text as="span"> Cliquez </Text>
                        <Link as="span" textDecoration="underline" color="teal.300" onClick={() => downloadKbis(request.kbis.contentUrl)}>ici</Link>
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
              {disabledRequests.map((request) => (
                <Card key={request.id} bg="gray.800" color="white" borderRadius="md" boxShadow="xl">
                  <CardHeader borderBottom="1px" borderColor="gray.700">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Heading size="md">{request.name}</Heading>
                      <Text fontSize="sm" color="gray.400">Fait le : {request.createdAt}</Text>
                    </Box>
                  </CardHeader>
                  <CardBody>
                    <List spacing={2}>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Adresse: </Text>
                        {request.address || "N/A"}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Email: </Text>
                        {request.email}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Téléphone: </Text>
                        {request.phone}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Site web: </Text>
                        {request.website || "N/A"}
                      </ListItem>
                      <ListItem>
                        <Text as="span" fontWeight="bold">Kbis:</Text>
                        <Text as="span"> Cliquez </Text>
                        <Link as="span" textDecoration="underline" color="teal.300" onClick={() => downloadKbis(request.kbis.contentUrl)}>ici</Link>
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
          <ModalHeader>Informations sur l'entreprise</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <Spinner size="xl" />
              </Box>
            ) : (
              <>
                {isValid === true ? (
                  <>
                    <Box display="flex" alignItems="center" color="green.500">
                      <Icon icon="icon-park-solid:check-one" style={{color: "green"}} />
                      <Text ml={2}>Les informations sont valides.</Text>
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
                      <FormLabel>Nom de l'entreprise</FormLabel>
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
                      <FormLabel>Date de création</FormLabel>
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
                    <Icon icon="mdi:alert-circle" style={{color: "#ff0000"}} />
                    <Text ml={2}>Les informations de l'entreprise sont invalides.</Text>
                  </Box>
                )}
              </>
            )}
          </ModalBody>

          <ModalFooter>
            {isValid && isEditable ? (
              <>
                <Button colorScheme="blue" mr={3} onClick={handleSave} isDisabled={isLoading}>
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setIsEditable(false)}>Annuler</Button>
              </>
            ) : isValid ? (
              <>
                <Button colorScheme="blue" mr={3} onClick={() => setIsEditable(true)}>Modifier</Button>
                <Button colorScheme="green" mr={3} onClick={handleValidate}>Approuver</Button>
                <Button variant="outline" mr={3} onClick={handleRefuse}>Refuser</Button>
              </>
            ) : isValid === false ? (
              <Button variant="outline" mr={3} onClick={handleRefuse}>Refuser</Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminPrestataireRequests;

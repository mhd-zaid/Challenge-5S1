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
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';

const AdminPrestataireRequests = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [siren, setSiren] = useState('');
  const [companyInfo, setCompanyInfo] = useState({ name: '', creationDate: '' });
  const [isEditable, setIsEditable] = useState(false);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const fetchCompaniesRequest = async () => {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/companies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let data = await response.json();
      data = data['hydra:member'].map((request) => ({
        ...request,
        createdAt: dayjs(request.createdAt).format('DD/MM/YYYY'),
      }));
      setRequests(data);
    };

    fetchCompaniesRequest();
  }, []);

  const downloadKbis = (url) => {
    window.open(import.meta.env.VITE_DOC_URL + url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  };

  useEffect(() => {
    if (isOpen) {
      getCompanyInfo();
    }
  }, [isOpen]);

  const getCompanyInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/info/company/${siren}`);
      const data = await response.json();
      if (response.ok) {
        setCompanyInfo({
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
    console.log('Company Info:', companyInfo);
    setIsEditable(false);
    onClose();
  };

  const handleValidate = () => {
    console.log('Company Info:', companyInfo);
    onClose();
  }

  const handleRefuse = () => {
    console.log('Company Info:', companyInfo);
    onClose();
  }

  return (
    <Box py={100} mx={"auto"} maxW={"80%"}>
      <Heading mb={5}>Gestion des demandes de prestataires</Heading>
      <SimpleGrid columns={3} spacing={10}>
        {requests.map((request) => (
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
            <CardFooter display="flex" justifyContent="flex-end" gap={4} borderTop="1px" borderColor="gray.700">
              <Button variant="solid" colorScheme="green" onClick={() => { setSiren(request.siren); onOpen(); }}>Vérifier le KBIS</Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

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
                      <Icon icon="icon-park-solid:check-one"  style={{color: "green"}} />
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
                    <Icon icon="mdi:alert-circle"  style={{color: "#ff0000"}} />
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
                <Button variant="success" mr={3}>Approuvé</Button>
                <Button variant={"outline"} mr={3}>Refuser</Button>
              </>
            ) : isValid === false ? (
              <Button variant={"outline"} mr={3}>Refuser</Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminPrestataireRequests;

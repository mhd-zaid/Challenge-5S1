import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Select
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import UnavailabilityService from '../services/UnavailabilityService';
import CompanyService from '../services/CompanyService';

const Unavailability = () => {
  const { token, user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  const toast = useToast();

  useEffect(() => {
    fetchRequests();
    get_company_detail();
  }, []);

  const fetchRequests = async () => {
    const response = await UnavailabilityService.get_unavailabilities(token);
    const data = await response.json();
    setRequests(data['hydra:member']);
  };

  const get_company_detail = async () => {
    await CompanyService.get_company_detail(token, user.company.split('/')[3]).then(response => response.json()).then(data => {
      setUsers(data.users['hydra:member']);
    });
  }

  const handleSubmit = async () => {
    const formData = {
      startTime: startDate,
      endTime: endDate,
      // reason,
      employee: user.roles.includes('ROLE_PRESTA') ? selectedUser : `/api/users/${user.id}`,
      status: user.roles.includes('ROLE_PRESTA') ? 'Accepted' : 'Pending'
    };

    await UnavailabilityService.create_unavailability(token, formData).then(response => {
      if (response.status === 201) {
        toast({
          title: 'Absence request submitted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }).catch(() => {
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }).then(() => {
      fetchRequests();
    });
  };

  const cancelUnavaibility = async (id) => {
    await UnavailabilityService.delete_unavailability(token, id.split('/')[3]).then(response => {
      if (response.status === 204) {
        toast({
          title: 'Absence request cancelled successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    ).catch(() => {
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }).then(() => {
      fetchRequests();
    });
  }

  const acceptUnavaibility = async (id) => {
    await UnavailabilityService.update_unavailability(token, id.split('/')[3], { status: 'Accepted' }).then(response => {
      if (response.status === 200) {
        toast({
          title: 'Absence request accepted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    ).catch(() => {
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }).then(() => {
      fetchRequests();
    });
  }

  const rejectUnavaibility = async (id) => {

    await UnavailabilityService.update_unavailability(token, id.split('/')[3], { status: 'Rejected' }).then(response => {
      if (response.status === 200) {
        toast({
          title: 'Absence request rejected successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    ).catch(() => {
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }).then(() => {
      fetchRequests();
    });
  }


  const pendingRequests = requests.filter(request => request.status === 'Pending');
  const historyRequests = requests.filter(request => ['Accepted', 'Rejected'].includes(request.status));


  return (
    <Flex w="full" h="100vh" justifyContent="center" alignItems="center" p="6">
      <Box bg="white" p="8" borderRadius="md" boxShadow="lg" w="full" maxW="lg">
        <Heading mb="7">Absences</Heading>
        <Tabs>
          <TabList>
            <Tab>Nouvelle demande</Tab>
            <Tab>Demandes en attentes</Tab>
            {user.roles.includes('ROLE_EMPLOYEE') && <Tab>History</Tab>}
          </TabList>

          <TabPanels>
            <TabPanel>
              <FormControl mb="4">
                <FormLabel>Début de l'absence</FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Select start date"
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Fin de l'absence</FormLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Select end date"
                />
            
            </FormControl>
            {user.roles.includes('ROLE_PRESTA') && (
              
              <FormControl mb={4}>
              <FormLabel>Utilisateur</FormLabel>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                placeholder="Sélectionnez un utilisateur"
              >
                {users.map((user) => (
                  <option key={user['@id']} value={user['@id']}>
                    {user.lastname} {user.firstname}
                  </option>
                ))}
              </Select>
            </FormControl>
            )
            }
              {/* <FormControl mb="4">
                <FormLabel>Reason</FormLabel>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Entrer la raison de l'absence"
                />
              </FormControl> */}
              <Button colorScheme="teal" onClick={handleSubmit}>
                Soumettre
              </Button>
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb="4">Demandes en attentes</Heading>
              {pendingRequests.length === 0 ? (
                <Text>Pas de demandes en attente</Text>
              ) : (
                pendingRequests.map(request => (
                  <Box key={request['@id']} mb="4" p="4" borderWidth="1px" borderRadius="md">
                    <Text><strong>Date de début:</strong> {request.startTime}</Text>
                    <Text><strong>Date de fin:</strong> {request.endTime}</Text>
                    {
                      user.roles.includes('ROLE_EMPLOYEE') && 
                      <Button onClick={() => cancelUnavaibility(request['@id'])}>Annuler ma demande</Button>
                    }
                    {
                      user.roles.includes('ROLE_PRESTA') && 
                      <Button onClick={() => acceptUnavaibility(request['@id'])}>Accepter</Button>
                    }
                    {
                      user.roles.includes('ROLE_PRESTA') && 
                      <Button onClick={() => rejectUnavaibility(request['@id'])}>Refuser</Button>
                    }
                    {/* <Text><strong>Reason:</strong> {request.reason}</Text> */}
                  </Box>
                ))
              )}
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb="4">History</Heading>
              {historyRequests.length === 0 ? (
                <Text>No historical requests</Text>
              ) : (
                historyRequests.map(request => (
                  <Box key={request.id} mb="4" p="4" borderWidth="1px" borderRadius="md">
                    <Text><strong>Start Date:</strong> {request.startTime}</Text>
                    <Text><strong>End Date:</strong> {request.endTime}</Text>
                    {/* <Text><strong>Reason:</strong> {request.reason}</Text> */}
                    <Text><strong>Status:</strong> {request.status}</Text>
                  </Box>
                ))
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Unavailability;

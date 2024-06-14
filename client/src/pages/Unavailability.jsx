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
  Text
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import UnavailabilityService from '../services/UnavailabilityService';

const Unavailability = () => {
  const { token, user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]);

  const toast = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const response = await UnavailabilityService.get_unavailabilities(token);
    const data = await response.json();
    setRequests(data['hydra:member']);
  };

  const handleSubmit = async () => {
    const formData = {
      startTime: startDate,
      endTime: endDate,
      reason,
      employee: user['@id'],
      status: 'Accepted'
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
    });
  };


  const pendingRequests = requests.filter(request => request.status === 'Pending');
  const historyRequests = requests.filter(request => ['Accepted', 'Rejected'].includes(request.status));


  return (
    <Flex w="full" h="100vh" justifyContent="center" alignItems="center" p="6">
      <Box bg="white" p="8" borderRadius="md" boxShadow="lg" w="full" maxW="lg">
        <Heading mb="6">Request Absence</Heading>
        <Tabs>
          <TabList>
            <Tab>New Request</Tab>
            <Tab>Pending Requests</Tab>
            <Tab>History</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <FormControl mb="4">
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Select start date"
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Select end date"
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Reason</FormLabel>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for absence"
                />
              </FormControl>
              <Button colorScheme="teal" onClick={handleSubmit}>
                Submit Request
              </Button>
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb="4">Pending Requests</Heading>
              {pendingRequests.length === 0 ? (
                <Text>No pending requests</Text>
              ) : (
                pendingRequests.map(request => (
                  <Box key={request.id} mb="4" p="4" borderWidth="1px" borderRadius="md">
                    <Text><strong>Start Date:</strong> {request.startTime}</Text>
                    <Text><strong>End Date:</strong> {request.endTime}</Text>
                    <Text><strong>Reason:</strong> {request.reason}</Text>
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
                    <Text><strong>Reason:</strong> {request.reason}</Text>
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

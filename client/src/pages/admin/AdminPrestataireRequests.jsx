import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, List, ListItem } from '@chakra-ui/react';
import { apiService } from '@/services/apiService.js';

const AdminPrestataireRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await apiService.getAll('companies');
      const data = await response.json();
      setRequests(data);
    };

    fetchRequests();
  }, []);

  const handleApprove = (id) => {
    // Logique pour approuver une demande
    console.log(`Approve request ${id}`);
  };

  const handleReject = (id) => {
    // Logique pour rejeter une demande
    console.log(`Reject request ${id}`);
  };

  return (
    <Box pt={100} h={"100vh"}>
      <Heading mb={5}>Gestion des demandes de prestataires</Heading>
      <List spacing={3}>
        {requests.map((request) => (
          <ListItem key={request.id}>
            <Flex justify="space-between" align="center">
              <Text>{request.name}</Text>
              <Box>
                <Button colorScheme="green" onClick={() => handleApprove(request.id)} mr={2}>
                  Approuver
                </Button>
                <Button colorScheme="red" onClick={() => handleReject(request.id)}>
                  Rejeter
                </Button>
              </Box>
            </Flex>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminPrestataireRequests;

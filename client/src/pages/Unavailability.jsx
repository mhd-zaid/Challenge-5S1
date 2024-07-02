import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  useToast,
  useDisclosure,
  Spinner,
  Flex,
  Select,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import UnavailabilityService from '../services/UnavailabilityService';
import CompanyService from '../services/CompanyService';
import HistoryUnavailabilityHourTable from '../components/Table/HistoryUnavailabilityHourTable';
import PendingUnavailabilityHourTable from '../components/Table/PendingUnavailabilityHourTable';

import NewUnavailabilityHourForm from '../components/forms/NewUnavailabilityHourForm';
import ConfirmationDialog from '../components/Modal/ConfirmationDialog';

const Unavailability = () => {
  const { token, user, isPrestataire } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentAction, setCurrentAction] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(true);

  const [pagePending, setPagePending] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [pageHistorical, setPageHistorical] = useState(1);
  const [itemsPerPageHistorical, setItemsPerPageHistorical] = useState(10);
  const [totalItemsHistorical, setTotalItemsHistorical] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchRequests();
    getCompanyDetail();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsRequestLoading(true);  
      const [pendingResponse, historyResponse] = await Promise.all([
        UnavailabilityService.get_unavailabilities(token, ['Pending'], pagePending, itemsPerPage, selectedUser),
        UnavailabilityService.get_unavailabilities(token, ['Accepted', 'Rejected'], pageHistorical, itemsPerPageHistorical, selectedUser),
      ]);
  
      const pendingData = await pendingResponse.json();
      const historyData = await historyResponse.json();
  
      setPendingRequests(pendingData['hydra:member']);
      setTotalItems(pendingData['hydra:totalItems']);
  
      setHistoryRequests(historyData['hydra:member']);
      setTotalItemsHistorical(historyData['hydra:totalItems']);
  
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsRequestLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [pageHistorical, itemsPerPageHistorical, selectedUser, pagePending, itemsPerPage, selectedUser]);

  const handlePageChange = (newPage) => {
    setPagePending(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPagePending(1);
  };

  const handlePageChangeHistorical = (newPage) => {
    setPageHistorical(newPage);
  };

  const handleItemsPerPageChangeHistorical = (newItemsPerPage) => {
    setItemsPerPageHistorical(newItemsPerPage);
    setPageHistorical(1);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setIsRequestLoading(true);
  };

  const getCompanyDetail = async () => {
    const response = await CompanyService.get_company_detail(
      token,
      user.company['@id'].split('/')[3],
    );
    const data = await response.json();
    setUsers(data.users);
  };

  const handleSubmit = async formData => {
    const response = await UnavailabilityService.create_unavailability(
      token,
      formData,
    );
    if (response.status === 201) {
      toast({
        title: 'Congés crée',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Une erreur est survenue',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    fetchRequests();
  };

  const handleActionClick = (action, requestId) => {
    const actions = {
      cancel: cancelUnavaibility,
      accept: acceptUnavaibility,
      reject: rejectUnavaibility,
    };
    setCurrentAction(() => () => actions[action](requestId));
    setCurrentRequestId(requestId);
    onOpen();
  };

  const handleConfirmAction = async () => {
    if (currentAction) {
      setIsLoading(true);
      await currentAction();
    }
  };

  const cancelUnavaibility = async id => {
    const response = await UnavailabilityService.delete_unavailability(
      token,
      id.split('/')[3],
    );
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
    fetchRequests().then(() => {
      onClose();
      setIsLoading(false);
    });
  };

  const acceptUnavaibility = async id => {
    const response = await UnavailabilityService.update_unavailability(
      token,
      id.split('/')[3],
      { status: 'Accepted' },
    );
    if (response.status === 200) {
      toast({
        title: 'Congés acceptés avec succès',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Une erreur est survenue',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    fetchRequests().then(() => {
      setIsLoading(false);
      onClose();
    });
  };

  const rejectUnavaibility = async id => {
    const response = await UnavailabilityService.update_unavailability(
      token,
      id.split('/')[3],
      { status: 'Rejected' },
    );
    if (response.status === 200) {
      toast({
        title: 'Congés refusés avec succès',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Une erreur est survenue',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    fetchRequests().then(() => {
      setIsLoading(false);
      onClose();
    });
  };

  return (
    <>
      {isRequestLoading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box p={4} w={"100%"}>
           { isPrestataire && (
            <Select placeholder="Tous" value={selectedUser} onChange={handleUserChange}>
              {users?.map((user) => (
                <option key={user['@id']} value={user['@id']}>
                  {user.firstname} {user.lastname}
                </option>
              ))}
            </Select>
           )
           } 
          <Tabs>
            <TabList>
              <Tab>Nouvelle demande</Tab>
              <Tab>Demandes en attente</Tab>
              {user.roles.includes('ROLE_EMPLOYEE') && <Tab>Historique</Tab>}
              {user.roles.includes('ROLE_PRESTA') && <Tab>Historique employés</Tab>}
            </TabList>
            <TabPanels>
              <TabPanel>
                <NewUnavailabilityHourForm
                  onSubmit={handleSubmit}
                  users={users}
                  user={user}
                />
              </TabPanel>
              <TabPanel>
                {pendingRequests.length === 0 ? (
                  <Text>Pas de demandes en attente</Text>
                ) : (
                  <PendingUnavailabilityHourTable
                    requests={pendingRequests}
                    onActionClick={handleActionClick}
                    user={user}
                    itemsPerPage={itemsPerPage}
                    page={pagePending}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}          
                  />
                )}
              </TabPanel>
              <TabPanel>
                <HistoryUnavailabilityHourTable
                requests={historyRequests}
                user={user}
                page={pageHistorical}
                itemsPerPage={itemsPerPageHistorical}
                totalItems={totalItemsHistorical}
                onPageChange={handlePageChangeHistorical}
                onItemsPerPageChange={handleItemsPerPageChangeHistorical}
                onActionClick={handleActionClick}
                 />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <ConfirmationDialog
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirmAction}
            cancelRef={cancelRef}
            isLoading={isLoading}
          />
        </Box>
      )}
    </>
  );
};

export default Unavailability;

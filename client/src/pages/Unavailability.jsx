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
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import UnavailabilityService from '../services/UnavailabilityService';
import CompanyService from '../services/CompanyService';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import HistoryUnavailabilityHourTable from '../components/Table/HistoryUnavailabilityHourTable';
import PendingUnavailabilityHourTable from '../components/Table/PendingUnavailabilityHourTable';

import NewUnavailabilityHourForm from '../components/forms/NewUnavailabilityHourForm';
import ConfirmationDialog from '../components/Modal/ConfirmationDialog';


dayjs.extend(utc);

const Unavailability = () => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentAction, setCurrentAction] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    fetchRequests();
    getCompanyDetail();
  }, []);

  const fetchRequests = async () => {
    const response = await UnavailabilityService.get_unavailabilities(token);
    const data = await response.json();
    setRequests(data['hydra:member']);
  };

  const getCompanyDetail = async () => {
    const response = await CompanyService.get_company_detail(token, user.company.split('/')[3]);
    const data = await response.json();
    setUsers(data.users['hydra:member']);
  };

  const handleSubmit = async (formData) => {
    const response = await UnavailabilityService.create_unavailability(token, formData);
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

  const handleConfirmAction = () => {
    if (currentAction) {
      currentAction();
    }
    onClose();
  };

  const cancelUnavaibility = async (id) => {
    const response = await UnavailabilityService.delete_unavailability(token, id.split('/')[3]);
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
    fetchRequests();
  };

  const acceptUnavaibility = async (id) => {
    const response = await UnavailabilityService.update_unavailability(token, id.split('/')[3], { status: 'Accepted' });
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
    fetchRequests();
  };

  const rejectUnavaibility = async (id) => {
    const response = await UnavailabilityService.update_unavailability(token, id.split('/')[3], { status: 'Rejected' });
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
    fetchRequests();
  };

  const pendingRequests = requests.filter(request => request.status === 'Pending');
  const historyRequests = requests.filter(request => ['Accepted', 'Rejected'].includes(request.status));

  return (
    <Box>
      <Heading mb="7">Absences</Heading>
      <Tabs>
        <TabList>
          <Tab>Nouvelle demande</Tab>
          <Tab>Demandes en attente</Tab>
          {user.roles.includes('ROLE_EMPLOYEE') && <Tab>Historique</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <NewUnavailabilityHourForm onSubmit={handleSubmit} users={users} user={user} />
          </TabPanel>
          <TabPanel>
            {pendingRequests.length === 0 ? (
              <Text>Pas de demandes en attente</Text>
            ) : (
              <PendingUnavailabilityHourTable requests={pendingRequests} onActionClick={handleActionClick} user={user} />
            )}
          </TabPanel>
          <TabPanel>
            <HistoryUnavailabilityHourTable requests={historyRequests} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmAction}
        cancelRef={cancelRef}
      />
    </Box>
  );
};

export default Unavailability;

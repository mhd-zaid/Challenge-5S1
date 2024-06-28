import { Table, Thead, Tbody, Tr, Th, Td, Text, Box, Button } from '@chakra-ui/react';
import useCustomDate from '@/hooks/useCustomDate';
import Pagination from '@/components/shared/Pagination';

const HistoryUnavailabilityHourTable = ({ requests, user, page, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange, onActionClick }) => {
  const dayjs = useCustomDate();

  return requests.length === 0 ? (
    <Text>Aucun historique</Text>
  ) : (
    <Box>
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Utilisateur</Th>
          <Th>Date de début</Th>
          <Th>Date de fin</Th>
          <Th>Statut</Th>
          {user.roles.includes('ROLE_PRESTA') && (
          <Th>Actions</Th> 
          )}
        </Tr>
      </Thead>
      <Tbody>
        {requests.map(request => (
          <Tr key={request.id}>
            <Td>{request.employee.firstname} {request.employee.lastname}</Td>
            <Td>
              {dayjs.utc(request.startTime).format('YYYY-MM-DD HH:mm:ss')}
            </Td>
            <Td>{dayjs.utc(request.endTime).format('YYYY-MM-DD HH:mm:ss')}</Td>
            <Td>{request.status}</Td>
            {user.roles.includes('ROLE_PRESTA') && (
            <Td>
              {request.status == 'Accepted' && (
                  <Button mr={4} onClick={() => onActionClick('cancel', request['@id'])}>Annuler le congé</Button>
              )}
            </Td>  
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
      <Pagination
      page={page}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      onPageChange={onPageChange}
      onItemsPerPageChange={onItemsPerPageChange}
    />
    </Box>
  );
};

export default HistoryUnavailabilityHourTable;

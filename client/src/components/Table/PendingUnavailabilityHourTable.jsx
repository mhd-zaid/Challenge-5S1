import { Table, Thead, Tbody, Tr, Th, Td, Button, Box } from '@chakra-ui/react';
import useCustomDate from '@/hooks/useCustomDate';

const PendingUnavailabilityHourTable = ({ requests, onActionClick, user }) => {
  const dayjs = useCustomDate();

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Utilisateur</Th>
          <Th>Date de début</Th>
          <Th>Date de fin</Th>
          <Th>Actions</Th>
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
            <Td>
              {user.roles.includes('ROLE_EMPLOYEE') && (
                <Button onClick={() => onActionClick('cancel', request['@id'])}>
                  Annuler ma demande
                </Button>
              )}
              {user.roles.includes('ROLE_PRESTA') && (
                <>
                  <Button mr={4}
                    onClick={() => onActionClick('accept', request['@id'])}
                  >
                    Accepter
                  </Button>
                  <Button
                    onClick={() => onActionClick('reject', request['@id'])}
                  >
                    Refuser
                  </Button>
                </>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default PendingUnavailabilityHourTable;

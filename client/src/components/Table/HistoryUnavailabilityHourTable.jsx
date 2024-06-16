import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

const HistoryUnavailabilityHourTable = ({ requests }) => {
  return (
    requests.length === 0 ? (
      <Text>No historical requests</Text>
    ) : (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date de début</Th>
            <Th>Date de fin</Th>
            <Th>Statut</Th>
          </Tr>
        </Thead>
        <Tbody>
          {requests.map(request => (
            <Tr key={request.id}>
              <Td>{dayjs.utc(request.startTime).format('YYYY-MM-DD HH:mm:ss')}</Td>
              <Td>{dayjs.utc(request.endTime).format('YYYY-MM-DD HH:mm:ss')}</Td>
              <Td>{request.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  );
};

export default HistoryUnavailabilityHourTable;

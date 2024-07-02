import { Box, Select, IconButton, Text } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const Pagination = ({ page, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
      <Select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))} width="fit-content">
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </Select>
      <Text>
        Affichage des lignes {startItem} à {endItem} sur {totalItems}
      </Text>
      <Box>
        <IconButton
          icon={<ArrowLeftIcon />}
          isDisabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          mr={2}
        />
        <IconButton
          icon={<ArrowRightIcon />}
          isDisabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </Box>
    </Box>
  );
};

export default Pagination;

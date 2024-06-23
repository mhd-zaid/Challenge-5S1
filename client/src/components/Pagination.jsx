import { Button, ButtonGroup } from '@chakra-ui/react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((num) => num + 1);

  return (
    <ButtonGroup spacing={2} mt={4}>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          colorScheme={page === currentPage ? 'blue' : 'gray'}
        >
          {page}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default Pagination;
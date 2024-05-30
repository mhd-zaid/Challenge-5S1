import { Box, Flex } from '@chakra-ui/react';
import FormCompany from '@/pages/info/FormCompany.jsx';
import { apiService } from '@/services/apiService.js';
import { useEffect, useState } from 'react';

const InfoPage = () => {

  return (
    <Flex
      direction='column'
    >
      <Box
        h='100vh'
        bgImage={`url('/image/shooting1.jpg')`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <FormCompany />
      </Box>
      <Box
        h='100vh'
        bg={"black"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        {/*<FormCompany />*/}
      </Box>
      <Box
        h='100vh'
        bg={"grey.200"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        {/*<FormCompany />*/}
      </Box>

    </Flex>
  );
}

export default InfoPage;
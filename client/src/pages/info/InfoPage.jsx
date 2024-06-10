import { Box, Button, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
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
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={"10em"}
      >
        <Heading color={"white"} mb={100} size="4xl">
          Instant Studio c'est...
        </Heading>
        <Flex
          gap="4">
            <Box
              h="250px" w={"500px"}
              bg={"gray.100"}
              p="8"
              boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
              transition="box-shadow 0.3s"
              _hover={{
                boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.4)"
              }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              borderInlineStart={0}>
              <Heading size="xl">40 000</Heading>
              <Text fontSize="md">professionnels</Text>
            </Box>
            <Box
              p="8"
              bg={"gray.100"}
              h="250px" w={"500px"}
              boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
              transition="box-shadow 0.3s"
              _hover={{
                boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.4)"
              }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              borderInlineStart={0}>
              <Heading size="xl">+10 Millions</Heading>
              <Text fontSize="md">de rendez-vous gérés par mois</Text>
            </Box>
            <Box
              p="8"
              bg={"gray.100"}
              h="250px" w={"500px"}
              boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
              transition="box-shadow 0.3s"
              _hover={{
                boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.4)"
              }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              onMouseEnter={(e) => e.currentTarget.querySelector(".button").style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.querySelector(".button").style.opacity = 0}
              borderInlineStart={0}>
              <Heading size="xl">+ 50%</Heading>
              <Text fontSize="md">des rdv en ligne pris en dehors des horatires d'ouverture</Text>
              <Box className="button" opacity={0} transition="opacity 0.3s">
                <Button
                  variant="flat"
                  size="sm"
                  mt="1rem"
                >
                  Ajouter votre établissement
                </Button>
              </Box>
            </Box>
          </Flex>
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
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import FormCompanyRequest from '@/components/forms/FormCompanyRequest.jsx';
import { useTranslation } from 'react-i18next';

const InfoPage = () => {
  const { t } = useTranslation();

  return (
    <Flex direction="column">
      <Box
        h="100vh"
        bgImage={`url('/image/shooting1.jpg')`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <Box
          p={10}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
          w="100%"
          maxW={['100%', '90%', '50%']}
          mx="auto"
          mt={8}
          rounded="md"
        >
          <Text fontSize="xl" mb={10} textAlign={'center'}>
            {t('company.request-text')}
          </Text>
          <FormCompanyRequest />
        </Box>
      </Box>
      <Box
        h="100vh"
        bg={'black'}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={'10em'}
      >
        <Heading color={'white'} mb={100} size="4xl">
          Instant Studio c'est...
        </Heading>
        <Flex gap="4">
          <Box
            h="250px"
            w={'500px'}
            bg={'gray.100'}
            p="8"
            boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
            transition="box-shadow 0.3s"
            _hover={{
              boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.4)',
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            borderInlineStart={0}
          >
            <Heading size="xl">40 000</Heading>
            <Text fontSize="md">professionnels</Text>
          </Box>
          <Box
            p="8"
            bg={'gray.100'}
            h="250px"
            w={'500px'}
            boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
            transition="box-shadow 0.3s"
            _hover={{
              boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.4)',
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            borderInlineStart={0}
          >
            <Heading size="xl">+10 Millions</Heading>
            <Text fontSize="md">de rendez-vous gérés par mois</Text>
          </Box>
          <Box
            p="8"
            bg={'gray.100'}
            h="250px"
            w={'500px'}
            boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
            transition="box-shadow 0.3s"
            _hover={{
              boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.4)',
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            borderInlineStart={0}
          >
            <Heading size="xl">+ 50%</Heading>
            <Text fontSize="md">
              des rdv en ligne pris en dehors des horatires d'ouverture
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box
        h="100vh"
        bg={'grey.200'}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
      </Box>
    </Flex>
  );
};

export default InfoPage;

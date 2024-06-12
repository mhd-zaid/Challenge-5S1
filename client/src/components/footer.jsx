import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Heading,
  Icon,
  Divider
} from '@chakra-ui/react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
function Footer() {
  return (
    <Box
      bg="black"
      color="white">
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8} fontFamily="Poppins, sans-serif">
        <Stack align={'flex-start'} gap="8">
          <Heading fontSize="x-large">Instant Studio</Heading>
          <Stack display="flex" direction="row" spacing={4} align="center">
            <Icon as={FaInstagram} boxSize={12} color="white"/>
            <Icon as={FaTiktok} boxSize={12} color="white" />
          </Stack>
        </Stack>
          <Stack align={'flex-start'} gap="8">
            <Heading fontSize="x-large">À propos de Instant Studio</Heading>
            <Stack>
              <Link href={'#'}>Ajouter votre établissement</Link>
              <Link href={'#'}>Rejoignez-nous</Link>
              <Link href={'#'}>CGU</Link>
              <Link href={'#'}>Gestion des cookies</Link>
            </Stack>
          </Stack>
          <Stack align={'flex-start'} gap="8">
            <Heading fontSize="x-large">Trouvez votre prestation</Heading>
            <Stack>
              <Link href={'#'}>Mariage</Link>
              <Link href={'#'}>Mode</Link>
              <Link href={'#'}>Évènementiel</Link>
              <Link href={'#'}>Culinaire</Link>
              <Link href={'#'}>Naissance</Link>
            </Stack>
          </Stack>
          <Stack align={'flex-start'} gap="8">
            <Heading fontSize="x-large">Recherches fréquentes</Heading>
            <Stack>
              <Link href={'#'}>Studio à Paris</Link>
              <Link href={'#'}>Studio à Bordeaux</Link>
              <Link href={'#'}>Studio Lyon</Link>
              <Link href={'#'}>Studio Marseille</Link>
              <Link href={'#'}>Studio Monaco</Link>
            </Stack>
          </Stack>
        </SimpleGrid>
        <Divider marginTop={'2em'}/>
        <Text  display="flex" align={'flex-start'} pt={6} fontSize={'sm'} textAlign={'center'} py={6}>
          © 2024 Instant Studio. All rights reserved
        </Text>
      </Container>
    </Box>
  );
}
export default Footer;
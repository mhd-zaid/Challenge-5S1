import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Heading,
  Icon,
  Divider,
  Button,
  Menu,
  MenuButton,
  Image,
  Flex,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext.jsx';

function Footer() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const getLanguageName = languageCode => {
    switch (languageCode) {
      case 'fr':
        return 'Français';
      case 'en':
        return 'English';
      default:
        return 'Français';
    }
  };

  return (
    <Box bg="black" color="white">
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          spacing={8}
          fontFamily="Poppins, sans-serif"
        >
          <Stack align={'flex-start'} gap="8">
            <Heading fontSize="x-large">Instant Studio</Heading>
            <Stack display="flex" direction="row" spacing={4} align="center">
              <Icon as={FaInstagram} boxSize={12} color="white" />
              <Icon as={FaTiktok} boxSize={12} color="white" />
            </Stack>
          </Stack>
          <Stack align={'flex-start'} gap="8">
            <Heading fontSize="x-large">{t('footer.about')}</Heading>
            <Stack>
              <Link
                href={
                  user && user.roles.includes('ROLE_ADMIN')
                    ? '/admin/control-center'
                    : '/info'
                }
              >
                {t('global.add-presta')}
              </Link>
              <Link href={'#'}>{t('footer.join-us')}</Link>
              <Link href={'#'}>{t('footer.cgu')}</Link>
              <Link href={'#'}>{t('footer.cookies')}</Link>
            </Stack>
          </Stack>
          <Stack align={'flex-start'} gap="8">
            <Heading fontSize="x-large">{t('footer.find-presta')}</Heading>
            <Stack>
              <Link href={'#'}>{t('footer.wedding')}</Link>
              <Link href={'#'}>{t('footer.fashion')}</Link>
              <Link href={'#'}>{t('footer.event')}</Link>
              <Link href={'#'}>{t('footer.cooking')}</Link>
              <Link href={'#'}>{t('footer.birth')}</Link>
            </Stack>
          </Stack>
          <Stack align={'flex-start'} gap="8">
            <Heading fontSize="x-large">{t('footer.popular-search')}</Heading>
            <Stack>
              <Link href={'/studios?city=Paris'}>Studio Paris</Link>
              <Link href={'/studios?city=Bordeaux'}>Studio Bordeaux</Link>
              <Link href={'/studios?city=Lyon'}>Studio Lyon</Link>
              <Link href={'/studios?city=Marseille'}>Studio Marseille</Link>
              <Link href={'/studios?city=Monaco'}>Studio Monaco</Link>
            </Stack>
          </Stack>
        </SimpleGrid>
        <Divider marginTop={'2em'} />
        <Flex justifyContent="space-between">
          <Text
            display="flex"
            align={'flex-start'}
            pt={6}
            fontSize={'sm'}
            textAlign={'center'}
            py={6}
          >
            © 2024 Instant Studio. All rights reserved
          </Text>
          <Menu>
            <MenuButton as={Button} variant={'bezel'}>
              <Flex alignItems="center">
                <Image src={`/lang/${i18n.language}.png`} w={4} h={4} mr={2} />
                <Text>{getLanguageName(i18n.language)}</Text>
              </Flex>
            </MenuButton>
            <MenuList color={'black'}>
              {i18n.options.supportedLngs.map(language => {
                if (language === 'cimode') return;
                return (
                  <MenuItem
                    as={Button}
                    key={language}
                    onClick={() => i18n.changeLanguage(language)}
                    variant={'unstyled'}
                    h={'fit-content'}
                  >
                    <Flex alignItems="center">
                      <Image src={`/lang/${language}.png`} w={4} h={4} mr={2} />
                      <Text>{getLanguageName(language)}</Text>
                    </Flex>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  );
}

export default Footer;

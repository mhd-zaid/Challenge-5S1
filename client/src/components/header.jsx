import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Flex,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  const { user, logout, isAdministrator, isPrestataire } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      bg="white"
      p="0 20px"
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height="60px"
      width="100vw"
      position="fixed"
      zIndex="100"
    >
      <Box>
        <Heading
          as={'h1'}
          m={0}
          fontSize="24px"
          fontWeight="bold"
          color="#333"
          cursor={'pointer'}
          onClick={() => navigate('/')}
        >
          Instant Studio
        </Heading>
      </Box>
      <Box mx={4}>
        {user ? (
          <Menu>
            <MenuButton as={Button} colorScheme="pink">
              <Icon
                icon="material-symbols:menu"
                fontSize={25}
                style={{ color: 'white' }}
              />
            </MenuButton>
            <MenuList>
              <MenuGroup
                title="Administration"
                hidden={!isAdministrator && !isPrestataire}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/admin/control-center');
                  }}
                  display={isAdministrator || isPrestataire ? 'block' : 'none'}
                >
                  {t('header.control-center')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/calendar');
                  }}
                  display={isPrestataire ? 'block' : 'none'}
                >
                  Plannings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/admin/prestataires-demandes');
                  }}
                  display={isAdministrator ? 'block' : 'none'}
                >
                  {t('header.presta-demand')}
                </MenuItem>
              </MenuGroup>
              <MenuDivider hidden={!isAdministrator && !isPrestataire} />
              <MenuGroup title="Profil">
                <MenuItem
                  onClick={() => {
                    navigate('/profile');
                  }}
                >
                  {t('header.my-account')}
                </MenuItem>
                <MenuItem onClick={logout}>{t('auth.logout')}</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        ) : (
          <Flex>
            <Button
              as={RouterLink}
              to="/info"
              variant={'outline'}
              bgColor={'gray.200'}
              mr={6}
            >
              {t('global.add-presta')}
            </Button>
            <Button
              as={RouterLink}
              to="/auth/login"
              bg="black"
              color="white"
              _hover={{ bg: '#333' }}
            >
              {t('auth.connect')}
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Header;

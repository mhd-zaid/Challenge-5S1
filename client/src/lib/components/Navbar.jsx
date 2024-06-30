import { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

const Navbar = ({ onLogout, menus }) => {
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
          as="h1"
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
              <MenuGroup title="Administration">
                <MenuItem
                  onClick={() => {
                    navigate('/admin/control-center');
                  }}
                  display={isAdministrator || isPrestataire ? 'block' : 'none'}
                >
                  Centre de contrôle
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
                    user.roles.includes('ROLE_ADMIN')
                      ? navigate('/admin/control-center')
                      : navigate('/info');
                  }}
                >
                  Ajouter votre établissement
                </MenuItem>
                <MenuItem display={isAdministrator ? 'block' : 'none'}>
                  Statistiques
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/admin/prestataires-demandes');
                  }}
                  display={isAdministrator ? 'block' : 'none'}
                >
                  Demandes de Prestataires
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Profil">
                <MenuItem
                  onClick={() => {
                    navigate('/profile');
                  }}
                >
                  Mon compte
                </MenuItem>
                <MenuItem onClick={logout}>Se déconnecter</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        ) : (
          <Button
            as={RouterLink}
            to="/auth/login"
            bg="black"
            color="white"
            _hover={{ bg: '#333' }}
          >
            {t('auth.connect')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;

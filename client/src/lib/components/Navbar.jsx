import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Button, Link } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

const Navbar = ({ onLogout, menus }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

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
          as={Link}
          href="/"
          fontSize="24px"
          fontWeight="bold"
          color="#333"
        >
          Instant Studio
        </Heading>
      </Box>
      <Box>
        {user && user.roles.includes('ROLE_ADMIN') && (
          <Button
            as={RouterLink}
            to="/admin/control-center"
            mr="10px"
            bg="#f3f3f3"
            color="black"
            _hover={{ bg: '#e2e2e2' }}
          >
            {t('global.control-center')}
          </Button>
        )}
        <Button mr="10px" bg="#f3f3f3" color="black" _hover={{ bg: '#e2e2e2' }}>
          {t('global.add-presta')}
        </Button>
        {!user ? (
          <Button
            as={RouterLink}
            to="/auth/login"
            bg="black"
            color="white"
            _hover={{ bg: '#333' }}
          >
            {t('auth.connect')}
          </Button>
        ) : (
          <Button
            onClick={logout}
            bg="black"
            color="white"
            _hover={{ bg: '#333' }}
          >
            Se déconnecter
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;

import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Button } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext.jsx';

const Navbar = ({ onLogout, menus }) => {
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
        <Heading as="h1" fontSize="24px" fontWeight="bold" color="#333">
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
            Centre de contrôle
          </Button>
        )}
        <Button
          mr="10px"
          bg="#f3f3f3"
          color="black"
          _hover={{ bg: '#e2e2e2' }}
        >
          Ajouter votre établissement
        </Button>
        {!user ? (
        <Button
          as={RouterLink}
          to="/auth/login"
          bg="black"
          color="white"
          _hover={{ bg: '#333' }}
        >
          Se connecter
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

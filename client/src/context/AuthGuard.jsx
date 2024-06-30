import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Flex, Spinner } from '@chakra-ui/react';

const AuthGuard = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <Flex justify="center" align="center" h="full">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default AuthGuard;

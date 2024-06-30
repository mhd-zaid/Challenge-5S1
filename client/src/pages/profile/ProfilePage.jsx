import { useAuth } from '@/context/AuthContext.jsx';
import AdminProfile from '@/pages/profile/AdminProfilePage.jsx';
import EmployeeProfile from '@/pages/profile/EmployeeProfilePage.jsx';
import CustomerProfile from '@/pages/profile/CustomerProfilePage.jsx';
import PrestaProfile from '@/pages/profile/PrestaProfilePage.jsx';
import { Box } from '@chakra-ui/react';

const ProfilePage = () => {
  const { user } = useAuth();

  const getPage = () => {
    if (user.roles.includes('ROLE_ADMIN')) {
      return <AdminProfile user={user} />;
    } else if (user.roles.includes('ROLE_PRESTA')) {
      return <PrestaProfile user={user} />;
    } else if (user.roles.includes('ROLE_EMPLOYEE')) {
      return <EmployeeProfile user={user} />;
    } else {
      return <CustomerProfile user={user} />;
    }
  };

  return (
    <Box maxW="7xl" mx="auto" p={6}>
      {getPage()}
    </Box>
  );
};

export default ProfilePage;

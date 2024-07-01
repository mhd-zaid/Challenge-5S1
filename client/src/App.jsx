import Header from './components/header';
import Footer from './components/footer';
import { AuthProvider } from './context/AuthContext';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Box flexDir={'column'} pt={'60px'} pb={24} w={'full'} minH={'100vh'}>
        <Outlet />
      </Box>
      <Footer />
    </AuthProvider>
  );
};

export default App;

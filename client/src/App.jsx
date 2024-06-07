import Header from './components/header';
import { Outlet } from 'react-router-dom';
import Footer from './components/footer';
import '@/App.css';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { Box } from '@chakra-ui/react';
import { HydraAdmin, ResourceGuesser } from '@api-platform/admin';


const menus = [
  { title: 'Contact', url: '/contact', requireAuth: false },
  { title: 'A propos', url: '/about', requireAuth: false },
];

const App = () => {
  return (
    <AuthProvider>
      <h1>{t('homepage.main-title')}</h1>
      <p>{t('description')}</p>
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
};

export default App;
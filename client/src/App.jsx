import { AuthProvider } from './context/AuthContext';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <h1>{t('homepage.main-title')}</h1>
      <p>{t('description')}</p>
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
}

export default App;

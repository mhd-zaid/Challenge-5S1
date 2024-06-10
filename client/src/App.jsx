import 'react-toastify/dist/ReactToastify.css';
import Header from './components/header';
import Footer from './components/footer';
import { AuthProvider } from './context/AuthContext';
import { Outlet } from 'react-router-dom';

const App = () => {

  const { t } = useTranslation();

  return (
    <AuthProvider>
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
};

export default App;
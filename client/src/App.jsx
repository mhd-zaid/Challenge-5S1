import Header from './components/header';
import Footer from './components/footer';
import { AuthProvider } from './context/AuthContext';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
};

export default App;

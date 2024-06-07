import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/header';
import Footer from './components/footer';
import '@/App.css';

const menus = [
  { title: 'Contact', url: '/contact', requireAuth: false },
  { title: 'A propos', url: '/about', requireAuth: false },
];

const App = () => {
  return (
    <AuthProvider>
      <Header menus={menus} />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
};

export default App;

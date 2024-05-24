import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/header';
import { Outlet } from 'react-router-dom';
import Footer from './components/footer';
import '@/App.css';
import { AuthProvider } from '@/Context/AuthContext.jsx';

const menus = [
  { title: 'Contact', url: '/contact', requireAuth: false },
  { title: 'A propos', url: '/about', requireAuth: false },
];

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Header menus={menus} />
        <div>
          <Outlet />
        </div>
        {/*<SearchComponent />*/}
        <Footer />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme={'colored'}
        transition:Bounce
      />
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;

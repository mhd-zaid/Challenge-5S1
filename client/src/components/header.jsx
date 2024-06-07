import AppNavbar from '@/lib/components/Navbar';
import { useAuth } from '@/context/AuthContext.jsx';
const Header = ({ menus }) => {
  const { setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return <AppNavbar onLogout={handleLogout} menus={menus} />;
};

export default Header;

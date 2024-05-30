import AppNavbar from '@/lib/components/Navbar';
import useToken from '../utils/useToken.js';
import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext.jsx";
const Header = ({ menus }) => {
  const { setToken } = useToken();
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
  };

  return <AppNavbar onLogout={handleLogout} menus={menus} />;
};

export default Header;
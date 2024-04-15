import useToken from '../utils/useToken.js';
import { useContext } from 'react';
import { AuthContext } from '@/Context/AuthContext.jsx';

const Header = () => {
  const { setToken } = useToken();
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
  };

  return <></>;
};

export default Header;

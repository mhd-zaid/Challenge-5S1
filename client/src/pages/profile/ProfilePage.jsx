import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import AdminProfile from '@/pages/profile/AdminProfilePage.jsx';
import EmployeeProfile from '@/pages/profile/EmployeeProfilePage.jsx';
import CustomerProfile from '@/pages/profile/CustomerProfilePage.jsx';
import PrestaProfile from '@/pages/profile/PrestaProfilePage.jsx';

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserInfo(data)
    }

    fetchUser();
  }, []);

    if(user.roles.includes('ROLE_ADMIN')) {
      return <AdminProfile user={userInfo} />
    } else if(user.roles.includes('ROLE_PRESTA')) {
      return <PrestaProfile user={userInfo} />
    } else if(user.roles.includes('ROLE_EMPLOYEE')) {
      return <EmployeeProfile user={userInfo} />
    } else {
      return <CustomerProfile user={userInfo} />
    }
};

export default ProfilePage;
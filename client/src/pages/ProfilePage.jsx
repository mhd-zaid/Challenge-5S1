import React, { useEffect } from "react";
import { useAuth} from "../context/AuthContext";
const ProfilePage = () => {
  const { user } = useAuth();

 useEffect(() => {
    console.log("USER : ", user);
  }, []);
  return <div>ProfilePage</div>;
};

export default ProfilePage;

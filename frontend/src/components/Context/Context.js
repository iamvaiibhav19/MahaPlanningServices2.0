import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userContext, setUserContext] = useState({});
  const token = localStorage.getItem('token');

  const getUser = async () => {
    const config = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    };

    const res = await axios.get('https://mahaplanningservices.herokuapp.com/api/v1/profile', config);
    setUserContext(res.data.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return <UserContext.Provider value={{ userContext, getUser }}>{children}</UserContext.Provider>;
}

export default UserContext;

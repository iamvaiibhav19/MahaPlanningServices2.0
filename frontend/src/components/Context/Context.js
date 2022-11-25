import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState();

  const getUser = async () => {
    const config = {
      withCredentials: true,
    };

    const res = await axios.get('http://localhost:8080/api/v1/profile', config);

    setUser(res.data.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return <UserContext.Provider value={{ user, getUser }}>{children}</UserContext.Provider>;
}

export default UserContext;

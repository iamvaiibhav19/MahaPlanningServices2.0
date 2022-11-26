import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState();
  const token = localStorage.getItem('token');

  const getUser = async () => {
    const config = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    };

    const res = await axios
      .get('https://mahaplanningservices.herokuapp.com/api/v1/profile', config)
      .then((res) => {
        console.log(res.data, 'res');
      })
      .catch((err) => {
        console.log(err, 'err');
        console.log(token, 'token');
      });

    setUser(res.data.user);
  };

  useEffect(() => {
    console.log(token, 'token');
    getUser();
  }, []);

  return <UserContext.Provider value={{ user, getUser }}>{children}</UserContext.Provider>;
}

export default UserContext;

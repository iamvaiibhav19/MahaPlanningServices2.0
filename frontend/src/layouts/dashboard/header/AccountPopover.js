import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function AccountPopover() {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('http://localhost:8080/api/v1/logout').then((res) => {
      console.log(res, 'res');
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    });
  };

  return (
    <>
      <LogoutIcon
        onClick={handleLogout}
        sx={{
          color: 'primary.main',
          width: 30,
          height: 30,
        }}
      />
    </>
  );
}

import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function SwitchLogin() {
  const navigate = useNavigate();

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

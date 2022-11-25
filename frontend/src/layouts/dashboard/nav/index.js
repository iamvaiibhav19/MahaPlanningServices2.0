import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import useResponsive from '../../../hooks/useResponsive';

import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import navConfig2 from './config2';
import axios from 'axios';
import UserContext from '../../../components/Context/Context.js';
import { useContext } from 'react';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { user } = useContext(UserContext);

  console.log(user, 'user dartata ');

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const [userData, setUserData] = useState();

  const [edit, setEdit] = useState(false);

  const getUserProfile = async () => {
    //cookies
    const token = localStorage.getItem('token');
    const config = {
      withCredentials: true,
    };

    const res = await axios.get('https://mahaplanningservices.herokuapp.com/api/v1/profile', config);

    setUserData(res.data.user);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src=" " alt="" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {
                  //if userData.email is more than 10 characters, then show only first 10 characters
                  user?.name
                }
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {
                  //if userData.email is more than 10 characters, then show only first 10 characters
                  user?.email
                }
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} dataDropdown={navConfig2} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import { useState } from 'react';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <Helmet>
        <title> Login | Maha Planning Services </title>
      </Helmet>

      <StyledRoot>
        {mdUp && (
          <StyledSection>
            <img
              src="/assets/logo.png"
              alt="login"
              style={{
                width: '70%',
                height: 'auto',
                margin: '0 auto',
              }}
            />
            <Typography variant="h4" sx={{ px: 5, mb: 5, textAlign: 'center' }}>
              Hello, Welcome to Maha Planning!
            </Typography>
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="contained"
              sx={{
                position: 'absolute',
                right: { xs: 0, sm: 0, md: 0 },
                marginTop: '20px',
                marginRight: '15px',
                //move to top right
              }}
              onClick={() => setToggle(!toggle)}
            >
              {toggle ? 'Coordinator Login' : 'Admin Login'}
            </Button>
          </div>

          <StyledContent>
            <LoginForm toggle={toggle} setToggle={setToggle} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}

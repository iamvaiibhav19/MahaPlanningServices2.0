import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Button, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import axios from 'axios';
import UserContext from 'src/components/Context/Context';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';

// ----------------------------------------------------------------------

export default function LoginForm(props) {
  const { getUser } = useContext(UserContext);

  useEffect(() => {
    getUser();
  }, []);
  const { toggle, setToggle } = props;
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  //react - cookies
  const [cookies, setCookie] = useCookies(['token']);

  const loginAdmin = () => {
    console.log(user, 'user');

    const config = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    axios
      .post('https://mahaplanningservices.herokuapp.com/api/v1/loginAdmin', user, config)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data, 'res');
          setCookie('token', res.data.token, { path: '/' });
          localStorage.setItem('token', res.data.token);
          getUser();
          navigate('/dashboard', { replace: true });
        }
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  };

  const loginCoordinator = () => {
    const config = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    axios
      .post('https://mahaplanningservices.herokuapp.com/api/v1/loginCoordinator', user, config)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data, 'res');
          localStorage.setItem('token', res.data.token);
          getUser();
          navigate('/dashboard', { replace: true });
        }
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  };

  return (
    <>
      <Stack spacing={3}>
        {!toggle ? (
          <>
            <TextField
              name="email"
              label="Email address"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </>
        ) : (
          <>
            <TextField
              name="email"
              label="Email address"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </>
        )}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/*
      <Checkbox name="remember" label="Remember me" />
              <Link variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
              */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={!toggle ? loginAdmin : loginCoordinator}
      >
        Login
      </LoadingButton>
    </>
  );
}

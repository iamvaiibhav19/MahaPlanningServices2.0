import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, FormControl, InputLabel, List, ListItemText, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import SvgColor from '../../components/svg-color';
import UserContext from '../Context/Context';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], dataDropdown = [], ...other }) {
  const [user, setUser] = useState({});
  const { userContext } = useContext(UserContext);
  console.log('userContext in navvvvvsection', userContext);

  const token = localStorage.getItem('token');

  const getUser = async () => {
    //cookies
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };

    const res = await axios.get('https://mahaplanningservices.herokuapp.com/api/v1/profile', config);
    setUser(res.data.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
        {dataDropdown.length > 0 && user?.role === 'admin' && DropdownLeads(dataDropdown)}
        {user?.role === 'admin' && (
          <NavItem
            item={{
              title: 'Coordinators',
              path: '/dashboard/coordinators',
              icon: icon('ic_user'),
            }}
          />
        )}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
        margin: '10px 0',
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}

function DropdownLeads(dataDropdown) {
  return (
    //dropdown
    <StyledNavItem component={RouterLink} to={'/dashboard/leads'} sx={{}}>
      {/* add dropdown to choose between leads and leads2 */}
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120, position: 'relative', right: '10px' }}>
        <Select
          sx={{
            focused: {
              backgroundColor: 'transparent',
              width: '100%',
            },
          }}
          fullWidth
          labelId="demo-simple-select-standard-label"
          defaultValue={dataDropdown[0].title}
          disableUnderline
        >
          {dataDropdown.map((item) => (
            <MenuItem value={item.title}>
              <StyledNavItem component={RouterLink} to={item.path}>
                <StyledNavItemIcon>{item.icon && item.icon}</StyledNavItemIcon>
                <ListItemText disableTypography primary={item.title} />
              </StyledNavItem>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </StyledNavItem>
  );
}

function sideBarDropdown(dataDropdown) {
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        defaultValue={dataDropdown[0].title}
        disableUnderline
        blurOnSelect
        sx={{
          //remove the hover effect
          '&:hover': {
            backgroundColor: 'transparent',
          },
          //background color transparent on focus
          '&:focus': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {dataDropdown.map((item) => (
          <MenuItem
            value={item.title}
            sx={{
              //remove the hover
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <StyledNavItem
              component={RouterLink}
              to={item.path}
              sx={{
                //remove hover effect
                '&:hover': {
                  bgcolor: 'transparent',
                },
              }}
            >
              <StyledNavItemIcon>{item.icon && item.icon}</StyledNavItemIcon>

              <ListItemText disableTypography primary={item.title} />
            </StyledNavItem>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

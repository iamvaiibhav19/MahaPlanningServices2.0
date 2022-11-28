import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import axios from 'axios';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email Id', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: '', label: '', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Coordinators() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState('');

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [message, setMessage] = useState('');

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setEditData({
      name: '',
      email: '',
      role: '',
    });
    setEditModal(false);
  };

  const [newCoordinator, setNewCoordinator] = useState({
    name: '',
    email: '',
    role: 'coordinator',
  });

  const [coordinators, setCoordinators] = useState([]);

  const getCoordinators = async () => {
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };

    axios.get('https://mahaplanningservices.herokuapp.com/api/v1/getCoordinators', config).then((res) => {
      console.log(res, 'res');
      console.log(res.data.coordinators, 'coordinators');
      setCoordinators(res.data.coordinators);
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = coordinators.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleAddCoordinator = () => {
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };

    axios
      .post('https://mahaplanningservices.herokuapp.com/api/v1/assignRole', newCoordinator, config)
      .then((res) => {
        console.log(res, 'res');
        setOpenModal(false);
        getCoordinators();
        setMessage('Coordinator added successfully');
        setNewCoordinator({
          name: '',
          email: '',
          role: 'coordinator',
        });
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    console.log(event.target.value, 'event.target.value');
    setPage(0);
    setFilterName(event.target.value);
  };

  const [editData, setEditData] = useState({
    name: '',
    email: '',
    role: 'coordinator',
  });

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - coordinators.length) : 0;

  const isNotFound = !coordinators.length;

  const filteredLeads = coordinators.filter((lead) => {
    return lead.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSearch = (e) => {
    console.log(e.target.value, 'e.target.value');
    setSearch(e.target.value);
  };

  const [editModal, setEditModal] = useState(false);

  const [coordinatorId, setCoordinatorId] = useState('');

  const handleOpenEditModal = () => {
    // console.log(id, 'id');
    setEditModal(true);
    setOpenModal(true);
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };
    axios.get(`https://mahaplanningservices.herokuapp.com/api/v1/coordinator/${coordinatorId}`, config).then((res) => {
      console.log(res, 'res');
      setEditData(res.data.coordinator);
    });
  };

  const handleDeleteCoordinator = () => {
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };
    axios
      .delete(`https://mahaplanningservices.herokuapp.com/api/v1/coordinator/${coordinatorId}`, config)
      .then((res) => {
        console.log(res, 'res');
        setOpenModal(false);
        handleCloseMenu();
        setCoordinatorId('');
        setMessage('Coordinator deleted successfully');
        setOpenSnackbar(true);
        getCoordinators();
      });
  };

  const handleEditCoordinator = () => {
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };
    axios
      .put(`https://mahaplanningservices.herokuapp.com/api/v1/coordinator/${coordinatorId}`, editData, config)
      .then((res) => {
        console.log(res, 'res');
        setOpenModal(false);
        setMessage('Coordinator updated successfully');
        setOpenSnackbar(true);
        setEditModal(false);
        setCoordinatorId('');
        getCoordinators();
        setEditData({
          name: '',
          email: '',
          role: 'coordinator',
        });
        handleCloseMenu();
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  useEffect(() => {
    getCoordinators();
  }, []);

  return (
    <>
      <Helmet>
        <title> Coordinators </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Coordinators
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setOpenModal(true);
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add New
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            searchValue={search}
            onSearch={handleSearch}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={coordinators.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredLeads?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { name, email, role, _id } = row;

                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">
                          {
                            role.charAt(0).toUpperCase() + role.slice(1) //ou
                          }
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => {
                              setCoordinatorId(_id);
                              console.log(_id, 'id');
                              handleOpenMenu(event);
                            }}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h5" sx={{ my: 3, color: 'red' }}>
                            No records found!
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={coordinators.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleOpenEditModal}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteCoordinator}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => {
          setOpenSnackbar(false);
        }}
      >
        <Alert
          onClose={() => {
            setOpenSnackbar(false);
          }}
          severity="success"
          sx={{ width: '100%', backgroundColor: '#4caf50', color: 'white' }}
        >
          {editModal ? 'Coordinator updated successfully' : 'Coordinator added successfully'}
        </Alert>
      </Snackbar>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <Container sx={style}>
          <Typography variant="h4" gutterBottom>
            {editModal ? 'Edit Coordinator' : 'Add New Coordinator'}
          </Typography>
          <TextField
            id="applicant-name"
            label="Name"
            variant="outlined"
            placeholder="Enter Name"
            fullWidth
            margin="normal"
            name="applicantName"
            value={editData?.name || newCoordinator?.name}
            onChange={(e) => {
              if (editModal) {
                setEditData({ ...editData, name: e.target.value });
              } else {
                setNewCoordinator({ ...newCoordinator, name: e.target.value });
              }
            }}
          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            placeholder="Enter Email Id"
            fullWidth
            margin="normal"
            name="email"
            value={editData?.email || newCoordinator?.email}
            onChange={(e) => {
              if (editModal) {
                setEditData({ ...editData, email: e.target.value });
              } else {
                setNewCoordinator({ ...newCoordinator, email: e.target.value });
              }
            }}
          />

          <Button
            variant="contained"
            onClick={editModal ? handleEditCoordinator : handleAddCoordinator}
            sx={{
              mt: 2,
            }}
          >
            {editModal ? 'Edit' : 'Add New'}
          </Button>
        </Container>
      </Modal>
    </>
  );
}

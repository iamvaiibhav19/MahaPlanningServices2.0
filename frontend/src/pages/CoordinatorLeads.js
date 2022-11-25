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
import axios from 'axios';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import UserContext from 'src/components/Context/Context';
import { useContext } from 'react';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Applicant Name', alignRight: false },
  { id: 'businessName', label: 'Business Name', alignRight: false },
  { id: 'communicationAddress', label: 'Communication Address', alignRight: false },
  { id: 'projectAddress', label: 'Project Unit Address', alignRight: false },
  { id: 'contactNo', label: 'Contact No.', alignRight: false },
  { id: 'emailId', label: 'Email Id', alignRight: false },
  { id: 'applicationDate', label: 'Application Date', alignRight: false },
  { id: 'validatyDate', label: 'Validaty Date', alignRight: false },
  { id: 'Service Type', label: 'Service Type', alignRight: false },
  { id: 'Payment Status', label: 'Payment Status', alignRight: false },
  { id: '', label: 'Action', alignRight: false },
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

export default function CoordinatorLeads() {
  const { user } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);
  const [leadId, setLeadId] = useState('');
  console.log('user', user);

  const handleEditLead = () => {
    const config = {
      withCredentials: true,
    };
    axios.put(`https://mahaplanningservices.herokuapp.com/api/v1/lead/${leadId}`, leadEditData, config).then((res) => {
      setOpenModal(false);
      setLeadEditData({
        name: '',
        businessName: '',
        communicationAddress: '',
        projectAddress: '',
        contactNo: '',
        emailId: '',
        applicationDate: '',
        validatyDate: '',
        ServiceType: '',
        PaymentStatus: '',
      });
      setLeadId('');
      getLeads();
    });
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '80%',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'auto',
  };

  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState('');

  const handleOpenMenu = (event, id) => {
    setLeadId(id);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const [leads, setLeads] = useState([]);

  const getLeads = async () => {
    const config = {
      withCredentials: true,
    };
    console.log(user?.role, 'user?.role');
    const getReq = user?.role === 'admin' ? '/allLeads' : '/leads/coordinator';

    axios.get(`https://mahaplanningservices.herokuapp.com/api/v1${getReq}`, config).then((res) => {
      console.log(res.data.data.leads, 'leads');
      setLeads(res.data.data.leads);
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = leads.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const [leadEditData, setLeadEditData] = useState({
    applicationDetails: {
      name: '',
      businessName: '',
      communicationAddress: '',
      projectAddress: '',
      contactNo: '',
      emailId: '',
      applicationDate: '',
      validatyDate: '',
    },
  });

  const [message, setMessage] = useState({
    status: '',
    note: '',
  });

  const getEditData = async (id) => {
    const config = {
      withCredentials: true,
    };
    setLeadId(id);
    axios.get(`https://mahaplanningservices.herokuapp.com/api/v1/lead/${id}`, config).then((res) => {
      console.log(res.data.data.lead, 'lead');
      setLeadEditData(res.data.data.lead);
    });
  };

  const deleteLead = async () => {
    const config = {
      withCredentials: true,
    };
    axios
      .delete(`https://mahaplanningservices.herokuapp.com/api/v1/lead/${leadId}`, config)
      .then((res) => {
        setMessage({
          status: 'success',
          note: 'Lead Deleted Successfully',
        });
        setOpenSnackbar(true);
        getLeads();
      })
      .catch((err) => {
        setMessage({
          status: 'error',
          note: 'Something went wrong',
        });
        setOpenSnackbar(true);
      });
  };

  useEffect(() => {
    getLeads();
  }, [user]);

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - leads.length) : 0;

  const isNotFound = !leads.length;

  const filteredLeads = leads.filter((lead) => {
    return lead.applicationDetails.applicantName.toLowerCase().includes(search.toLowerCase());
  });

  const handleSearch = (e) => {
    console.log(e.target.value, 'e.target.value');
    setSearch(e.target.value);

    //search by name through leads array
  };

  useEffect(() => {
    getLeads();
  }, []);

  return (
    <>
      <Helmet>
        <title> Leads </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Leads
          </Typography>{' '}
          <Button
            variant="contained"
            onClick={() => {
              navigate('/dashboard/forms', { replace: true });
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Lead
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
                  rowCount={leads.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredLeads?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { applicationDetails, registrationFees, paymentInfo, _id } = row;

                    const selectedUser = selected.indexOf(applicationDetails.applicantName) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUser}
                            onChange={(event) => handleClick(event, applicationDetails.applicantName)}
                          />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {applicationDetails?.applicantName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{applicationDetails?.businessName}</TableCell>

                        <TableCell align="left">{applicationDetails?.communicationAddress}</TableCell>

                        <TableCell align="left">{applicationDetails?.projectUnitAddress}</TableCell>

                        <TableCell align="left">{applicationDetails?.contactNo}</TableCell>
                        <TableCell align="left">{applicationDetails?.emailId}</TableCell>
                        <TableCell align="left">
                          {format(new Date(applicationDetails?.applicationDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell align="left">
                          {format(new Date(applicationDetails?.validityDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell align="left">
                          {registrationFees?.serviceType ? registrationFees?.serviceType : 'N/A'}
                        </TableCell>
                        <TableCell align="left">
                          {registrationFees?.serviceType.length > 0 && paymentInfo?.paymentStatus.length < 1
                            ? 'Pending'
                            : 'N/A'}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(e) => {
                              console.log(_id, 'id');
                              handleOpenMenu(e, _id);
                              getEditData(_id);
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
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
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
            count={leads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <Container sx={style}>
          <Typography variant="h4" gutterBottom>
            Edit Lead
          </Typography>
          <TextField
            id="applicant-name"
            label="Applicant Name"
            variant="outlined"
            placeholder="Enter Applicant Name"
            fullWidth
            margin="normal"
            name="applicantName"
            value={leadEditData?.applicationDetails?.applicantName}
            onChange={(e) => {
              setLeadEditData({
                ...leadEditData,
                applicationDetails: {
                  ...leadEditData.applicationDetails,
                  applicantName: e.target.value,
                },
              });
            }}
          />
          <TextField
            id="business-name"
            label="Business Name"
            variant="outlined"
            placeholder="Enter Business Name"
            fullWidth
            margin="normal"
            name="businessName"
            value={leadEditData?.applicationDetails?.businessName}
            onChange={(e) => {
              setLeadEditData({
                ...leadEditData,
                applicationDetails: {
                  ...leadEditData.applicationDetails,
                  businessName: e.target.value,
                },
              });
            }}
          />
          <TextField
            id="communicationAddress"
            label="Communication Address"
            variant="outlined"
            placeholder="Enter Communication Address"
            fullWidth
            margin="normal"
            name="communicationAddress"
            value={leadEditData?.applicationDetails?.communicationAddress}
            onChange={(e) => {
              setLeadEditData({
                ...leadEditData,
                applicationDetails: {
                  ...leadEditData.applicationDetails,
                  communicationAddress: e.target.value,
                },
              });
            }}
          />
          <TextField
            id="projectAddress"
            label="Project Unit Address"
            variant="outlined"
            placeholder="Enter Project Unit Address"
            fullWidth
            margin="normal"
            name="projectAddress"
            value={leadEditData?.applicationDetails?.projectUnitAddress}
            onChange={(e) => {
              setLeadEditData({
                ...leadEditData,
                applicationDetails: {
                  ...leadEditData.applicationDetails,
                  projectUnitAddress: e.target.value,
                },
              });
            }}
          />
          <TextField
            id="contactNo"
            label="Contact No"
            variant="outlined"
            placeholder="Enter Contact No"
            fullWidth
            margin="normal"
            name="contactNo"
            value={leadEditData?.applicationDetails?.contactNo}
            onChange={(e) => {
              setLeadEditData({
                ...leadEditData,
                applicationDetails: {
                  ...leadEditData.applicationDetails,
                  contactNo: e.target.value,
                },
              });
            }}
          />
          <TextField
            id="emailId"
            label="Email Id"
            variant="outlined"
            placeholder="Enter Email Id"
            fullWidth
            margin="normal"
            name="emailId"
            value={leadEditData?.applicationDetails?.emailId}
            onChange={(e) => {
              setLeadEditData({
                ...leadEditData,
                applicationDetails: {
                  ...leadEditData.applicationDetails,
                  emailId: e.target.value,
                },
              });
            }}
          />
          <TextField
            id="applicationDate"
            label="Application Date"
            placeholder="Enter Application Date"
            variant="outlined"
            fullWidth
            margin="normal"
            name="applicationDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={
              leadEditData?.applicationDetails?.applicationDate
                ? format(new Date(leadEditData?.applicationDetails?.applicationDate), 'yyyy-MM-dd')
                : ''
            }
            onChange={(e) => {
              setLeadEditData({
                ...leadEditData,
                applicationDetails: {
                  ...leadEditData.applicationDetails,
                  applicationDate: e.target.value,
                },
              });
            }}
          />
          <TextField
            id="validityDate"
            label="Validity Date"
            placeholder="Enter Validity Date"
            variant="outlined"
            fullWidth
            margin="normal"
            name="validityDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={
              //format date to 2018-11-13 format
              leadEditData?.applicationDetails?.validityDate
                ? format(new Date(leadEditData?.applicationDetails?.validityDate), 'yyyy-MM-dd')
                : ''
            }
            onChange={(e) => {
              setLeadEditData({
                ...leadEditData,
                applicationDetails: {
                  ...leadEditData.applicationDetails,
                  validityDate: e.target.value,
                },
              });
            }}
          />

          <Button
            variant="contained"
            onClick={handleEditLead}
            sx={{
              mt: 2,
            }}
          >
            Edit
          </Button>
        </Container>
      </Modal>

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
          severity={message.status}
          sx={{ width: '100%' }}
        >
          {message.note}
        </Alert>
      </Snackbar>

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
        <MenuItem
          onClick={() => {
            setOpenModal(true);
            handleCloseMenu();
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            deleteLead();
            handleCloseMenu();
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

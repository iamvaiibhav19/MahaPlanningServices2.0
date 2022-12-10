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
  FormControl,
  Select,
  InputLabel,
  TableHead,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import axios from 'axios';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import UserContext from 'src/components/Context/Context';
import { useContext } from 'react';
import DropFileInput from '../pages/drop-file-input/DropFileInput';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'Application No.', alignRight: false },
  { id: 'name', label: 'Applicant Name', alignRight: false },
  { id: 'businessName', label: 'Business Name', alignRight: false },
  { id: 'communicationAddress', label: 'Communication Address', alignRight: false },
  { id: 'projectAddress', label: 'Project Unit Address', alignRight: false },
  { id: 'contactNo', label: 'Contact No.', alignRight: false },
  { id: 'contactNo', label: 'Additional Contact No.', alignRight: false },
  { id: 'emailId', label: 'Email Id', alignRight: false },
  { id: 'applicationDate', label: 'Application Date', alignRight: false },
  { id: 'validatyDate', label: 'Validaty Date', alignRight: false },
  { id: 'Service Type', label: 'Service Type', alignRight: false },
  { id: 'registrationFee', label: 'Registration Fee Details', alignRight: false },
  { id: 'Payment Status', label: 'Payment Status', alignRight: false },
  { id: 'Documents', label: 'Documents', alignRight: false },
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

export default function Newleads() {
  const token = localStorage.getItem('token');
  const { user } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);
  const [leadId, setLeadId] = useState('');

  const [detailModal, setDetailModal] = useState(false);
  console.log('user', user);

  console.log('this is admin loead');

  const handleEditLead = () => {
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };
    axios
      .put(`${process.env.REACT_APP_BASE_URL}/api/v1/lead/${leadId}`, leadEditData, config)
      .then((res) => {
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
        setMessage({
          status: 'success',
          note: 'Lead Updated Successfully',
        });
        setOpenSnackbar(true);
        getLeads();
      })
      .catch((err) => {
        console.log(err);
        setMessage({
          status: 'error',
          note: 'Something went wrong',
        });
        setOpenSnackbar(true);
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
  const style2 = {
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
      headers: {
        token: token,
      },
    };
    console.log(user?.role, 'user?.role');
    const getReq = user?.role === 'admin' ? '/allLeads' : '/leads/coordinator';

    axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1${getReq}`, config).then((res) => {
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

  const [leadEditData, setLeadEditData] = useState(null);

  const [message, setMessage] = useState({
    status: '',
    note: '',
  });

  const getEditData = async (id) => {
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };
    setLeadId(id);
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/lead/${id}`, config).then((res) => {
      console.log(res.data.data.lead, 'lead');
      setLeadEditData(res.data.data.lead);
    });
  };

  const deleteLead = async () => {
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/v1/lead/${leadId}`, config)
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

  const paymentPendings = filteredLeads.filter((lead) => {
    return lead.paymentInfo.paymentStatus === 'pending';
  });

  const handleSearch = (e) => {
    console.log(e.target.value, 'e.target.value');
    setSearch(e.target.value);

    //search by name through leads array
  };

  const [openDocModal, setOpenDocModal] = useState(false);

  const [openViewModal, setOpenViewModal] = useState(false);

  const [documents, setDocuments] = useState([]);

  const onFileChange = (files) => {
    console.log(files);
  };

  useEffect(() => {
    getLeads();
  }, []);

  return (
    <>
      <Helmet>
        <title> Payment Pendings </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Payment Pendings
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
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.length === leads.length}
                        color="primary"
                        indeterminate={selected.length > 0 && selected.length < leads.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell align="center" sx={{ minWidth: '150px' }}>
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paymentPendings?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { applicationNo, applicationDetails, registrationFees, paymentInfo, _id, uploadFile } = row;
                    console.log(uploadFile, 'uploadFile');

                    const formId = _id;

                    const selectedUser = selected.indexOf(applicationDetails.applicantName) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUser}
                            onChange={(event) => handleClick(event, applicationDetails.applicantName)}
                          />
                        </TableCell>

                        <TableCell align="center">{applicationNo}</TableCell>
                        <TableCell align="center">{applicationDetails?.applicantName}</TableCell>

                        <TableCell align="center">{applicationDetails?.businessName}</TableCell>

                        <TableCell align="center">{applicationDetails?.communicationAddress}</TableCell>

                        <TableCell align="center">{applicationDetails?.projectUnitAddress}</TableCell>

                        <TableCell align="center">{applicationDetails?.contactNo}</TableCell>
                        <TableCell align="center">
                          {applicationDetails?.contactNo2 ? applicationDetails?.contactNo2 : '-'}
                        </TableCell>
                        <TableCell align="center">{applicationDetails?.emailId}</TableCell>
                        <TableCell align="center">
                          {format(new Date(applicationDetails?.applicationDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell align="center">
                          {format(new Date(applicationDetails?.validityDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell align="center">
                          {registrationFees?.serviceType
                            ? registrationFees?.serviceType.charAt(0).toUpperCase() +
                              registrationFees?.serviceType.slice(1)
                            : 'N/A'}
                        </TableCell>
                        <TableCell align="center">
                          <TextSnippetIcon
                            sx={{
                              cursor: 'pointer',
                              color: 'primary.main',
                            }}
                            onClick={() => {
                              setDetailModal(true);
                              getEditData(formId);
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {paymentInfo?.paymentStatus === ''
                            ? 'N/A'
                            : paymentInfo?.paymentStatus.charAt(0).toUpperCase() + paymentInfo?.paymentStatus.slice(1)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{
                              margin: '5px',
                            }}
                            onClick={() => {
                              setOpenViewModal(true);
                              setDocuments(uploadFile);
                            }}
                          >
                            View
                          </Button>
                          <AddIcon
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                              setLeadId(formId);
                              setOpenDocModal(true);
                            }}
                            sx={{
                              backgroundColor: 'green',
                              color: 'white',
                              cursor: 'pointer',
                            }}
                          />
                        </TableCell>

                        <TableCell align="center">
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
            count={leads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Modal
        open={openDocModal}
        onClose={() => {
          setOpenDocModal(false);
          setLeadId('');
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container sx={style2}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              marginBottom: '20px',
              fontWeight: 'bold',
              fontSize: '30px',
            }}
          >
            Upload Documents
          </Typography>
          <DropFileInput
            onFileChange={onFileChange}
            leadId={leadId}
            getLeads={getLeads}
            setOpenDocModal={setOpenDocModal}
          />
        </Container>
      </Modal>

      <Modal
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setDocuments([]);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container sx={style2}>
          {documents.length > 0 &&
            documents?.map((doc) => {
              return (
                <a
                  href={doc}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                  }}
                >
                  <Button variant="contained" color="primary" size="small">
                    {`Document ${documents.indexOf(doc) + 1}`}
                  </Button>
                </a>
              );
            })}
          {documents.length === 0 && (
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              No Documents Uploaded
            </Typography>
          )}
        </Container>
      </Modal>

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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Service Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              value={leadEditData?.registrationFees?.serviceType}
              onChange={(e) => {
                setLeadEditData({
                  ...leadEditData,
                  registrationFees: {
                    ...leadEditData.registrationFees,
                    serviceType: e.target.value,
                  },
                });
              }}
            >
              <MenuItem value="industrial">Industrial</MenuItem>
              <MenuItem value="fpo">FPO</MenuItem>
              <MenuItem value="standupIndia">Standup India</MenuItem>
            </Select>
          </FormControl>

          {(leadEditData?.registrationFees?.serviceType === 'fpo' ||
            leadEditData?.registrationFees?.serviceType === 'standupIndia') && (
            <TextField
              required
              id="totalAmountPayable"
              label="Total Amount Payable"
              variant="outlined"
              placeholder="Enter Total Amount Payable"
              fullWidth
              margin="normal"
              name="totalAmountPayable"
              value={leadEditData?.registrationFees?.totalAmountPayable}
              onChange={(e) => {
                setLeadEditData({
                  ...leadEditData,
                  registrationFees: {
                    ...leadEditData.registrationFees,
                    totalAmountPayable: e.target.value,
                    bussinessPlanFees: (e.target.value * 0.2).toFixed(0),
                    projectAssistanceFees: (e.target.value * 0.17).toFixed(0),
                    companyIncorporationFees: (e.target.value * 0.35).toFixed(0),
                    fundAssistanceFees: (e.target.value * 0.14).toFixed(0),
                    schemeFees: (e.target.value * 0.14).toFixed(0),
                  },
                });
              }}
            />
          )}
          {leadEditData?.registrationFees?.serviceType === 'industrial' && (
            <TextField
              required
              id="totalAmountPayable"
              label="Total Amount Payable"
              variant="outlined"
              placeholder="Enter Total Amount Payable"
              fullWidth
              margin="normal"
              name="totalAmountPayable"
              value={leadEditData?.registrationFees?.totalAmountPayable}
              onChange={(e) =>
                setLeadEditData({
                  ...leadEditData,
                  registrationFees: {
                    ...leadEditData.registrationFees,
                    totalAmountPayable: e.target.value,
                    documentationVerificationFee: (e.target.value * 0.12).toFixed(0),
                    projectRegistrationFee: (e.target.value * 0.22).toFixed(0),
                    projectManagementFee: (e.target.value * 0.3).toFixed(0),
                    projectDevelopmentFee: (e.target.value * 0.24).toFixed(0),
                    fundingAssistanceFee: (e.target.value * 0.12).toFixed(0),
                  },
                })
              }
            />
          )}
          {leadEditData?.registrationFees?.serviceType === 'industrial' && (
            <>
              <TextField
                id="documentationFees"
                label="Documentation and Verification Fees"
                variant="outlined"
                placeholder="Enter Documentation and Verification Fee"
                fullWidth
                margin="normal"
                name="documentationFees"
                value={
                  leadEditData.registrationFees.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.12).toFixed(0)
                    : 0
                }
                disabled
              />
              <TextField
                id="projectRegistrationFees"
                label="Project Registration & E-Filing Fees"
                variant="outlined"
                placeholder="Enter Project Registration & E-Filing Fees"
                fullWidth
                margin="normal"
                name="projectRegistrationFees"
                value={
                  leadEditData.registrationFees.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.22).toFixed(0)
                    : 0
                }
                disabled
              />
              <TextField
                id="projectManagementFees"
                label="Project Management Fees"
                variant="outlined"
                placeholder="Enter Project Management Fees"
                fullWidth
                margin="normal"
                value={
                  leadEditData.registrationFees.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.3).toFixed(0)
                    : 0
                }
                name="projectManagementFees"
                disabled
              />
              <TextField
                id="projectDevelopmentFees"
                label="Project Development and Monitoring Fees"
                variant="outlined"
                placeholder="Enter Project Development and Monitoring Fees"
                fullWidth
                margin="normal"
                name="projectDevelopmentFees"
                value={
                  leadEditData.registrationFees.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.24).toFixed(0)
                    : 0
                }
                disabled
              />
              <TextField
                id="consultancyFees"
                label="Funding Assistance and Consultation Fees"
                variant="outlined"
                placeholder="Enter Funding Assistance and Consultation Fees"
                fullWidth
                margin="normal"
                value={
                  leadEditData?.registrationFees?.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.12).toFixed(0)
                    : 0
                }
                name="consultancyFees"
                disabled
              />
            </>
          )}
          {(leadEditData?.registrationFees?.serviceType === 'fpo' ||
            leadEditData?.registrationFees?.serviceType === 'standupIndia') && (
            <>
              <TextField
                id="incorporationFees"
                label="Company Incorporation Fees"
                variant="outlined"
                placeholder="Enter Company Incorporation Fees"
                fullWidth
                margin="normal"
                name="incorporationFees"
                value={
                  leadEditData?.registrationFees?.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.35).toFixed(0)
                    : 0
                }
                disabled
              />
              <TextField
                id="bussinessPlanFees"
                label="Business Planning & Monitoring Fees"
                variant="outlined"
                placeholder="Enter Business Planning & Monitoring Fees"
                fullWidth
                margin="normal"
                name="bussinessPlanFees"
                value={
                  leadEditData.registrationFees.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.2).toFixed(0)
                    : 0
                }
                disabled
              />
              <TextField
                id="projectAssistanceFees"
                label="Project Assistance & Consultation Fees"
                variant="outlined"
                placeholder="Enter Project Assistance & Consultation Fees"
                fullWidth
                margin="normal"
                name="projectAssistanceFees"
                value={
                  leadEditData.registrationFees.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.17).toFixed(0)
                    : 0
                }
                disabled
              />
              <TextField
                id="fundAssistanceFees"
                label="Funding Assistance & Consultation Fees"
                variant="outlined"
                placeholder="Enter Funding Assistance & Consultation Fees"
                fullWidth
                margin="normal"
                name="fundAssistanceFees"
                value={
                  leadEditData.registrationFees.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.14).toFixed(0)
                    : 0
                }
                disabled
              />
              <TextField
                id="schemeFees"
                label="Schematic Information & Assistance Fees"
                variant="outlined"
                placeholder="Enter Schematic Information & Assistance Fees"
                fullWidth
                margin="normal"
                name="schemeFees"
                value={
                  leadEditData.registrationFees.totalAmountPayable
                    ? (leadEditData.registrationFees.totalAmountPayable * 0.14).toFixed(0)
                    : 0
                }
                disabled
              />
            </>
          )}

          {leadEditData?.registrationFees?.totalAmountPayable && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel id="demo-simple-select-label">Payment Status</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Payment Status"
                  value={leadEditData?.paymentInfo?.paymentStatus}
                  onChange={(e) => {
                    setLeadEditData({
                      ...leadEditData,
                      paymentInfo: {
                        ...leadEditData.paymentInfo,
                        paymentStatus: e.target.value,
                      },
                    });
                  }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {leadEditData?.paymentInfo?.paymentStatus === 'done' && (
            <>
              <TextField
                required
                id="transactionId"
                label="Transaction No."
                variant="outlined"
                placeholder="Enter Transaction No."
                fullWidth
                margin="normal"
                name="transactionId"
                value={leadEditData?.paymentInfo?.transactionId}
                onChange={(e) =>
                  setLeadEditData({
                    ...leadEditData,
                    paymentInfo: {
                      ...leadEditData.paymentInfo,
                      transactionId: e.target.value,
                    },
                  })
                }
              />
              <TextField
                required
                id="paymentMode"
                label="Payment Mode"
                variant="outlined"
                placeholder="Enter Payment Mode"
                fullWidth
                margin="normal"
                name="paymentMode"
                value={leadEditData?.paymentInfo?.paymentMethod}
                onChange={(e) =>
                  setLeadEditData({
                    ...leadEditData,
                    paymentInfo: {
                      ...leadEditData.paymentInfo,
                      paymentMethod: e.target.value,
                    },
                  })
                }
              />
              <TextField
                required
                id="paymentDate"
                label="Payment Date"
                variant="outlined"
                placeholder="Enter Payment Date"
                fullWidth
                margin="normal"
                type="date"
                name="paymentDate"
                InputLabelProps={{
                  shrink: true,
                }}
                value={
                  leadEditData?.paymentInfo?.paymentDate
                    ? format(new Date(leadEditData?.paymentInfo?.paymentDate), 'yyyy-MM-dd')
                    : ''
                }
                onChange={(e) =>
                  setLeadEditData({
                    ...leadEditData,
                    paymentInfo: {
                      ...leadEditData.paymentInfo,
                      paymentDate: e.target.value,
                    },
                  })
                }
              />
            </>
          )}

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

      <Modal
        open={detailModal}
        onClose={() => {
          setDetailModal(false);
          setLeadEditData(null);
        }}
      >
        <Container sx={style}>
          <Typography variant="h4" gutterBottom>
            Registration Fee Details
          </Typography>

          {
            //condition if leadEditData is empty
            leadEditData?.registrationFees?.serviceType !== '' ? (
              <>
                <TextField
                  id="serviceType"
                  label="Service Type"
                  variant="outlined"
                  placeholder="Enter Service Type"
                  fullWidth
                  margin="normal"
                  name="serviceType"
                  value={
                    leadEditData?.registrationFees?.serviceType === 'standupIndia'
                      ? 'Standup India'
                      : leadEditData?.registrationFees?.serviceType === 'fpo'
                      ? 'FPO'
                      : 'Industrial'
                  }
                  disabled
                />

                {(leadEditData?.registrationFees?.serviceType === 'fpo' ||
                  leadEditData?.registrationFees?.serviceType === 'standupIndia') && (
                  <TextField
                    required
                    id="totalAmountPayable"
                    label="Total Amount Payable"
                    variant="outlined"
                    placeholder="Enter Total Amount Payable"
                    fullWidth
                    margin="normal"
                    name="totalAmountPayable"
                    disabled
                    value={leadEditData?.registrationFees?.totalAmountPayable}
                    onChange={(e) => {
                      setLeadEditData({
                        ...leadEditData,
                        registrationFees: {
                          ...leadEditData.registrationFees,
                          totalAmountPayable: e.target.value,
                          bussinessPlanFees: (e.target.value * 0.2).toFixed(0),
                          projectAssistanceFees: (e.target.value * 0.17).toFixed(0),
                          companyIncorporationFees: (e.target.value * 0.35).toFixed(0),
                          fundAssistanceFees: (e.target.value * 0.14).toFixed(0),
                          schemeFees: (e.target.value * 0.14).toFixed(0),
                        },
                      });
                    }}
                  />
                )}
                {leadEditData?.registrationFees?.serviceType === 'industrial' && (
                  <TextField
                    required
                    id="totalAmountPayable"
                    label="Total Amount Payable"
                    variant="outlined"
                    placeholder="Enter Total Amount Payable"
                    fullWidth
                    margin="normal"
                    disabled
                    name="totalAmountPayable"
                    value={leadEditData?.registrationFees?.totalAmountPayable}
                    onChange={(e) =>
                      setLeadEditData({
                        ...leadEditData,
                        registrationFees: {
                          ...leadEditData.registrationFees,
                          totalAmountPayable: e.target.value,
                          documentationVerificationFee: (e.target.value * 0.12).toFixed(0),
                          projectRegistrationFee: (e.target.value * 0.22).toFixed(0),
                          projectManagementFee: (e.target.value * 0.3).toFixed(0),
                          projectDevelopmentFee: (e.target.value * 0.24).toFixed(0),
                          fundingAssistanceFee: (e.target.value * 0.12).toFixed(0),
                        },
                      })
                    }
                  />
                )}
                {leadEditData?.registrationFees?.serviceType === 'industrial' && (
                  <>
                    <TextField
                      id="documentationFees"
                      label="Documentation and Verification Fees"
                      variant="outlined"
                      placeholder="Enter Documentation and Verification Fee"
                      fullWidth
                      margin="normal"
                      name="documentationFees"
                      value={
                        leadEditData.registrationFees.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.12).toFixed(0)
                          : 0
                      }
                      disabled
                    />
                    <TextField
                      id="projectRegistrationFees"
                      label="Project Registration & E-Filing Fees"
                      variant="outlined"
                      placeholder="Enter Project Registration & E-Filing Fees"
                      fullWidth
                      margin="normal"
                      name="projectRegistrationFees"
                      value={
                        leadEditData.registrationFees.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.22).toFixed(0)
                          : 0
                      }
                      disabled
                    />
                    <TextField
                      id="projectManagementFees"
                      label="Project Management Fees"
                      variant="outlined"
                      placeholder="Enter Project Management Fees"
                      fullWidth
                      margin="normal"
                      value={
                        leadEditData.registrationFees.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.3).toFixed(0)
                          : 0
                      }
                      name="projectManagementFees"
                      disabled
                    />
                    <TextField
                      id="projectDevelopmentFees"
                      label="Project Development and Monitoring Fees"
                      variant="outlined"
                      placeholder="Enter Project Development and Monitoring Fees"
                      fullWidth
                      margin="normal"
                      name="projectDevelopmentFees"
                      value={
                        leadEditData.registrationFees.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.24).toFixed(0)
                          : 0
                      }
                      disabled
                    />
                    <TextField
                      id="consultancyFees"
                      label="Funding Assistance and Consultation Fees"
                      variant="outlined"
                      placeholder="Enter Funding Assistance and Consultation Fees"
                      fullWidth
                      margin="normal"
                      value={
                        leadEditData?.registrationFees?.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.12).toFixed(0)
                          : 0
                      }
                      name="consultancyFees"
                      disabled
                    />
                  </>
                )}
                {(leadEditData?.registrationFees?.serviceType === 'fpo' ||
                  leadEditData?.registrationFees?.serviceType === 'standupIndia') && (
                  <>
                    <TextField
                      id="incorporationFees"
                      label="Company Incorporation Fees"
                      variant="outlined"
                      placeholder="Enter Company Incorporation Fees"
                      fullWidth
                      margin="normal"
                      name="incorporationFees"
                      value={
                        leadEditData?.registrationFees?.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.35).toFixed(0)
                          : 0
                      }
                      disabled
                    />
                    <TextField
                      id="bussinessPlanFees"
                      label="Business Planning & Monitoring Fees"
                      variant="outlined"
                      placeholder="Enter Business Planning & Monitoring Fees"
                      fullWidth
                      margin="normal"
                      name="bussinessPlanFees"
                      value={
                        leadEditData.registrationFees.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.2).toFixed(0)
                          : 0
                      }
                      disabled
                    />
                    <TextField
                      id="projectAssistanceFees"
                      label="Project Assistance & Consultation Fees"
                      variant="outlined"
                      placeholder="Enter Project Assistance & Consultation Fees"
                      fullWidth
                      margin="normal"
                      name="projectAssistanceFees"
                      value={
                        leadEditData.registrationFees.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.17).toFixed(0)
                          : 0
                      }
                      disabled
                    />
                    <TextField
                      id="fundAssistanceFees"
                      label="Funding Assistance & Consultation Fees"
                      variant="outlined"
                      placeholder="Enter Funding Assistance & Consultation Fees"
                      fullWidth
                      margin="normal"
                      name="fundAssistanceFees"
                      value={
                        leadEditData.registrationFees.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.14).toFixed(0)
                          : 0
                      }
                      disabled
                    />
                    <TextField
                      id="schemeFees"
                      label="Schematic Information & Assistance Fees"
                      variant="outlined"
                      placeholder="Enter Schematic Information & Assistance Fees"
                      fullWidth
                      margin="normal"
                      name="schemeFees"
                      value={
                        leadEditData.registrationFees.totalAmountPayable
                          ? (leadEditData.registrationFees.totalAmountPayable * 0.14).toFixed(0)
                          : 0
                      }
                      disabled
                    />
                  </>
                )}

                {leadEditData?.registrationFees?.totalAmountPayable && (
                  <>
                    <TextField
                      id="paymentStatus"
                      label="Payment Status"
                      variant="outlined"
                      placeholder="Enter Payment Status"
                      fullWidth
                      margin="normal"
                      name="paymentStatus"
                      value={leadEditData?.paymentInfo?.paymentStatus === 'done' ? 'Done' : 'Pending'}
                      disabled
                    />
                  </>
                )}

                {leadEditData?.paymentInfo?.paymentStatus === 'done' && (
                  <>
                    <TextField
                      required
                      id="transactionId"
                      label="Transaction No."
                      variant="outlined"
                      placeholder="Enter Transaction No."
                      fullWidth
                      margin="normal"
                      name="transactionId"
                      value={leadEditData?.paymentInfo?.transactionId}
                      onChange={(e) =>
                        setLeadEditData({
                          ...leadEditData,
                          paymentInfo: {
                            ...leadEditData.paymentInfo,
                            transactionId: e.target.value,
                          },
                        })
                      }
                      disabled
                    />
                    <TextField
                      required
                      id="paymentMode"
                      label="Payment Mode"
                      variant="outlined"
                      placeholder="Enter Payment Mode"
                      fullWidth
                      margin="normal"
                      name="paymentMode"
                      value={leadEditData?.paymentInfo?.paymentMethod}
                      onChange={(e) =>
                        setLeadEditData({
                          ...leadEditData,
                          paymentInfo: {
                            ...leadEditData.paymentInfo,
                            paymentMethod: e.target.value,
                          },
                        })
                      }
                      disabled
                    />
                    <TextField
                      required
                      id="paymentDate"
                      label="Payment Date"
                      variant="outlined"
                      placeholder="Enter Payment Date"
                      fullWidth
                      margin="normal"
                      name="paymentDate"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={
                        leadEditData?.paymentInfo?.paymentDate &&
                        format(new Date(leadEditData?.paymentInfo?.paymentDate), 'dd/MM/yyyy')
                      }
                      disabled
                    />
                  </>
                )}
              </>
            ) : (
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  color: 'red',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  margin: 'auto',
                }}
              >
                Not Applicable!
              </Typography>
            )
          }
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

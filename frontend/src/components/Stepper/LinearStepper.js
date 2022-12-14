import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Alert,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import Select from '@mui/material/Select';
import DropFileInput from '../drop-file-input/DropFileInput';
import './inputBox.css';
import { Container } from '@mui/system';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import UserContext from '../Context/Context';
import { useContext } from 'react';
import isEmail from 'validator/lib/isEmail';

function getSteps() {
  return ['Basic Details', 'Registration Fees', 'Bank Details', 'Upload Document'];
}

function getSteps2() {
  return ['Basic Details', 'Upload Document'];
}

const onFileChange = (files) => {
  console.log(files);
};

function getStepContent(
  step,
  form,
  setForm,
  user,
  displayFinish,
  setDisplayFinish,
  handleFinish,
  isValid,
  setIsValid,
  leadUploadId,
  setLeadUploadId
) {
  const role = user?.role;
  switch (step) {
    case 0:
      return (
        <>
          <TextField
            required
            id="applicant-name"
            label="Applicant Name As Per Aadhar Card"
            variant="outlined"
            placeholder="Enter Applicant Name As Per Aadhar Card"
            fullWidth
            margin="normal"
            name="applicantName"
            value={form.applicationDetails.applicantName}
            onChange={(e) =>
              setForm({
                ...form,
                applicationDetails: {
                  ...form.applicationDetails,
                  applicantName: e.target.value,
                },
              })
            }
          />
          <TextField
            required
            id="business-name"
            label="Business Name"
            variant="outlined"
            placeholder="Enter Business Name"
            fullWidth
            margin="normal"
            name="businessName"
            value={form.applicationDetails.businessName}
            onChange={(e) =>
              setForm({
                ...form,
                applicationDetails: {
                  ...form.applicationDetails,
                  businessName: e.target.value,
                },
              })
            }
          />
          <TextField
            required
            id="communicationAddress"
            label="Communication Address"
            variant="outlined"
            placeholder="Enter Communication Address"
            fullWidth
            margin="normal"
            name="communicationAddress"
            value={form.applicationDetails.communicationAddress}
            onChange={(e) =>
              setForm({
                ...form,
                applicationDetails: {
                  ...form.applicationDetails,
                  communicationAddress: e.target.value,
                },
              })
            }
          />
          <TextField
            required
            id="projectAddress"
            label="Project Unit Address"
            variant="outlined"
            placeholder="Enter Project Unit Address"
            fullWidth
            margin="normal"
            name="projectAddress"
            value={form.applicationDetails.projectUnitAddress}
            onChange={(e) =>
              setForm({
                ...form,
                applicationDetails: {
                  ...form.applicationDetails,
                  projectUnitAddress: e.target.value,
                },
              })
            }
          />
          <TextField
            id="pinCode"
            label="Pin Code"
            variant="outlined"
            placeholder="Enter Pin Code"
            fullWidth
            required
            margin="normal"
            name="pinCode"
            value={form.applicationDetails.pinCode}
            onChange={(e) =>
              setForm({
                ...form,
                applicationDetails: {
                  ...form.applicationDetails,
                  pinCode: e.target.value,
                },
              })
            }
          />
          <TextField
            type="number"
            required
            id="contactNo"
            label="Contact No"
            variant="outlined"
            placeholder="Enter Contact No"
            fullWidth
            // accept only 10 digit number
            margin="normal"
            name="contactNo"
            value={form.applicationDetails.contactNo}
            onChange={(e) =>
              //allow only 10 digit number
              e.target.value.length <= 10 &&
              setForm({
                ...form,
                applicationDetails: {
                  ...form.applicationDetails,
                  contactNo: e.target.value,
                },
              })
            }
          />

          <TextField
            required
            type="email"
            id="emailId"
            label="Email Id"
            variant="outlined"
            placeholder="Enter Email Id"
            fullWidth
            margin="normal"
            name="emailId"
            value={form.applicationDetails.emailId}
            error={!isValid && form.applicationDetails.emailId !== ''}
            helperText={!isValid && form.applicationDetails.emailId !== '' ? 'Invalid Email' : ''}
            onChange={(e) =>
              //check if email is valid
              {
                isEmail(e.target.value) ? setIsValid(true) : setIsValid(false);
                setForm({
                  ...form,
                  applicationDetails: {
                    ...form.applicationDetails,
                    emailId: e.target.value,
                  },
                });
              }
            }
          />
          <TextField
            required
            id="applicationDate"
            label="Application Date"
            placeholder="Enter Application Date"
            variant="outlined"
            fullWidth
            margin="normal"
            name="applicationDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.applicationDetails?.applicationDate}
            onChange={(e) =>
              setForm({
                ...form,
                applicationDetails: {
                  ...form.applicationDetails,
                  applicationDate: e.target.value,
                },
              })
            }
          />
          {user?.role === 'admin' && (
            <TextField
              required
              id="validityDate"
              label="Validity Date"
              placeholder="Enter Validity Date"
              variant="outlined"
              fullWidth
              margin="normal"
              name="validityDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.applicationDetails?.validityDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  applicationDetails: {
                    ...form.applicationDetails,
                    validityDate: e.target.value,
                  },
                })
              }
            />
          )}
          {user?.role === 'coordinator' && (
            <TextField
              required
              id="projectCost"
              label="Project Cost"
              placeholder="Enter Project Cost"
              variant="outlined"
              fullWidth
              margin="normal"
              name="projectCost"
              type="number"
              value={form.applicationDetails?.projectCost}
              onChange={(e) =>
                setForm({
                  ...form,
                  applicationDetails: {
                    ...form.applicationDetails,
                    projectCost: e.target.value,
                  },
                })
              }
            />
          )}
        </>
      );

    case 1:
      return (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Service Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              value={form.registrationFees.serviceType}
              onChange={(e) =>
                setForm({
                  ...form,
                  registrationFees: {
                    ...form.registrationFees,
                    serviceType: e.target.value,
                  },
                })
              }
            >
              <MenuItem value="industrial">Industrial, Agriculture Project Management & Developement Service</MenuItem>
              <MenuItem value="fpo">FPO</MenuItem>
              <MenuItem value="standupIndia">Standup India</MenuItem>
            </Select>
          </FormControl>
          {form.registrationFees.serviceType === 'industrial' && (
            <TextField
              id="totalAmountPayable"
              label="Total Amount Payable"
              variant="outlined"
              placeholder="Enter Total Amount Payable"
              fullWidth
              margin="normal"
              name="totalAmountPayable"
              value={form.registrationFees.totalAmountPayable}
              onChange={(e) =>
                setForm({
                  ...form,
                  registrationFees: {
                    ...form.registrationFees,
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

          {(form.registrationFees.serviceType === 'fpo' || form.registrationFees.serviceType === 'standupIndia') && (
            <TextField
              id="totalAmountPayable"
              label="Total Amount Payable"
              variant="outlined"
              placeholder="Enter Total Amount Payable"
              fullWidth
              margin="normal"
              name="totalAmountPayable"
              value={form.registrationFees.totalAmountPayable}
              onChange={(e) =>
                setForm({
                  ...form,
                  registrationFees: {
                    ...form.registrationFees,
                    totalAmountPayable: e.target.value,
                    bussinessPlanFees: (e.target.value * 0.2).toFixed(0),
                    projectAssistanceFees: (e.target.value * 0.17).toFixed(0),
                    companyIncorporationFees: (e.target.value * 0.35).toFixed(0),
                    fundAssistanceFees: (e.target.value * 0.14).toFixed(0),
                    schemeFees: (e.target.value * 0.14).toFixed(0),
                  },
                })
              }
            />
          )}

          {form.registrationFees.serviceType === 'industrial' && (
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.12).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.22).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.3).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.24).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.12).toFixed(0)
                    : 0
                }
                name="consultancyFees"
                disabled
              />
            </>
          )}
          {form.registrationFees.serviceType === 'fpo' && (
            <>
              <TextField
                id="companyIncorporationFees"
                label="Company Incorporation Fees"
                variant="outlined"
                placeholder="Enter Company Incorporation Fees"
                fullWidth
                margin="normal"
                name="companyIncorporationFees"
                value={
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.35).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.2).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.17).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.14).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.14).toFixed(0)
                    : 0
                }
                disabled
              />
            </>
          )}
          {form.registrationFees.serviceType === 'standupIndia' && (
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.35).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.2).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.17).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.14).toFixed(0)
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
                  form.registrationFees.totalAmountPayable
                    ? (form.registrationFees.totalAmountPayable * 0.14).toFixed(0)
                    : 0
                }
                disabled
              />
            </>
          )}
          {form.registrationFees.totalAmountPayable && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel id="demo-simple-select-label">Payment Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Payment Status"
                  value={form.paymentInfo.paymentStatus}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentInfo: {
                        ...form.paymentInfo,
                        paymentStatus: e.target.value,
                      },
                    })
                  }
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          {form.paymentInfo.paymentStatus === 'done' && (
            <>
              <TextField
                id="transactionId"
                label="Transaction No."
                variant="outlined"
                placeholder="Enter Transaction No."
                fullWidth
                margin="normal"
                name="transactionId"
                value={form.paymentInfo.transactionId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentInfo: {
                      ...form.paymentInfo,
                      transactionId: e.target.value,
                    },
                  })
                }
              />
              <TextField
                id="paymentMode"
                label="Payment Mode"
                variant="outlined"
                placeholder="Enter Payment Mode"
                fullWidth
                margin="normal"
                name="paymentMode"
                value={form.paymentInfo.paymentMethod}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentInfo: {
                      ...form.paymentInfo,
                      paymentMethod: e.target.value,
                    },
                  })
                }
              />
              <TextField
                id="paymentDate"
                label="Payment Date"
                variant="outlined"
                placeholder="Enter Payment Date"
                fullWidth
                margin="normal"
                type="date"
                name="paymentDate"
                value={form.paymentInfo.paymentDate}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentInfo: {
                      ...form.paymentInfo,
                      paymentDate: e.target.value,
                    },
                  })
                }
              />
            </>
          )}
        </>
      );

    case 2:
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextField
            required
            id="bankName"
            label="Bank Name"
            variant="outlined"
            placeholder="Enter Bank Name"
            halfWidth
            margin="normal"
            name="bankName"
            value={form.bankDetails?.bankName}
            onChange={(e) =>
              setForm({
                ...form,
                bankDetails: {
                  ...form.bankDetails,
                  bankName: e.target.value,
                },
              })
            }
          />

          <TextField
            required
            id="accountNumber"
            label="Branch"
            variant="outlined"
            placeholder="Enter Branch Name"
            halfWidth
            margin="normal"
            name="accountNumber"
            value={form.bankDetails?.branch}
            onChange={(e) =>
              setForm({
                ...form,
                bankDetails: {
                  ...form.bankDetails,
                  branch: e.target.value,
                },
              })
            }
          />
          <TextField
            required
            id="accountNumber"
            label="Account Number"
            variant="outlined"
            placeholder="Enter Account Number"
            halfWidth
            margin="normal"
            name="accountNumber"
            value={form.bankDetails?.accountNumber}
            onChange={(e) =>
              setForm({
                ...form,
                bankDetails: {
                  ...form.bankDetails,
                  accountNumber: e.target.value,
                },
              })
            }
          />
          <TextField
            required
            id="bankName"
            label="IFSC Code"
            variant="outlined"
            placeholder="Enter IFSC Code"
            halfWidth
            margin="normal"
            name="bankName"
            value={form.bankDetails?.ifscCode}
            onChange={(e) =>
              setForm({
                ...form,
                bankDetails: {
                  ...form.bankDetails,
                  ifscCode: e.target.value,
                },
              })
            }
          />
        </div>
      );

    case 3:
      return (
        <>
          <div className="box">
            <Typography variant="h6" gutterBottom style={{ textAlign: 'center', marginBottom: '20px' }}>
              Upload Document
            </Typography>
            <Container
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
            >
              <DropFileInput
                onFileChange={onFileChange}
                displayFinish={displayFinish}
                setDisplayFinish={setDisplayFinish}
                form={form}
                setForm={setForm}
                handleFinish={handleFinish}
              />
            </Container>
          </div>
        </>
      );
    default:
      return 'unknown step';
  }
}

const LinearStepper = () => {
  const { userContext, getUser } = useContext(UserContext);
  console.log(userContext, 'user from context');
  const [activeStep, setActiveStep] = useState(0);
  const [displayFinish, setDisplayFinish] = useState(false);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [leadUploadId, setLeadUploadId] = useState('');

  const [open, setOpen] = useState(false);

  const [user, setUser] = useState();
  const token = localStorage.getItem('token');

  const getUserData = async () => {
    //cookies
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };

    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/profile`, config);

    setUser(res.data.user);
  };

  const [isValid, setIsValid] = useState(false);

  const [form, setForm] = useState({
    applicationDetails: {
      applicantName: '',
      businessName: '',
      communicationAddress: '',
      projectUnitAddress: '',
      contactNo: '',
      emailId: '',
      applicationDate: '',
      validityDate: '',
    },
    registrationFees: {
      serviceType: '',
      totalAmountPayable: '',
    },
    paymentInfo: {
      paymentStatus: '',
      paymentDate: '',
      paymentMethod: '',
      transactionId: '',
    },
  });

  const steps = getSteps();

  const steps2 = getSteps2();

  const isStepOptional = (step) => {
    return step === 1 || step === 2;
  };

  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (
        form.applicationDetails.applicantName === '' ||
        form.applicationDetails.businessName === '' ||
        form.applicationDetails.communicationAddress === '' ||
        form.applicationDetails.projectUnitAddress === '' ||
        form.applicationDetails.pinCode === '' ||
        form.applicationDetails.contactNo === '' ||
        form.applicationDetails.emailId === '' ||
        form.applicationDetails.applicationDate === ''
      ) {
        setOpen(true);
        setMessage({
          status: 'error',
          note: 'Fill all * fields',
        });
        return;
      }
    }
    if (user?.role === 'coordinator') {
      //move to next step
      if (activeStep === 0) {
        setActiveStep(3);
        return;
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
    if (activeStep === 1) {
      if (form.registrationFees.serviceType !== '' && form.registrationFees.totalAmountPayable === '') {
        setOpen(true);
        setMessage({
          status: 'error',
          note: 'Fill all * fields',
        });
        return;
      }
      if (
        form.registrationFees.serviceType === '' &&
        form.registrationFees.totalAmountPayable !== '' &&
        form.paymentInfo.paymentStatus === ''
      ) {
        setOpen(true);
        setMessage({
          status: 'error',
          note: 'Fill all * fields',
        });
        return;
      }

      if (
        form.registrationFees.serviceType !== '' &&
        form.registrationFees.totalAmountPayable !== '' &&
        form.paymentInfo.paymentStatus !== ''
      ) {
        if (form.paymentInfo.paymentStatus === 'done') {
          if (
            form.paymentInfo.paymentDate === '' ||
            form.paymentInfo.paymentMethod === '' ||
            form.paymentInfo.transactionId === ''
          ) {
            console.log('here');
            setOpen(true);
            setMessage({
              status: 'error',
              note: 'Fill all * fields',
            });
            return;
          }
        }
      }
    }

    setActiveStep(activeStep + 1);
    setSkippedSteps(skippedSteps.filter((skipItem) => skipItem !== activeStep));
  };

  const handleFinish = () => {
    const token = localStorage.getItem('token');
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/v1/lead/new`, form, config)
      .then((res) => {
        console.log(res, 'handle finsihi');
        console.log(res.data);
        setLeadUploadId(res.data.form._id);
        setMessage({
          status: 'success',
          note: 'Lead created successfully',
        });

        setForm({
          applicationDetails: {
            applicantName: '',
            businessName: '',
            communicationAddress: '',
            projectUnitAddress: '',
            contactNo: '',
            contactNo2: '',
            emailId: '',
            applicationDate: '',
            validityDate: '',
          },
          registrationFees: {
            serviceType: '',
            totalAmountPayable: '',
          },
          paymentInfo: {
            paymentStatus: '',
            paymentDate: '',
            paymentMethod: '',
            transactionId: '',
          },
        });

        setActiveStep(0);

        setOpen(true);
      })
      .catch((err) => {
        setOpen(true);
        setMessage({
          status: 'error',
          note: 'Something went wrong',
        });

        console.log(err);
      });
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    if (user?.role === 'coordinator' && activeStep === 3) {
      setActiveStep(0);
      return;
    }
  };

  const handleSkip = () => {
    if (!isStepSkipped(activeStep)) {
      setSkippedSteps([...skippedSteps, activeStep]);
    }
    setActiveStep(activeStep + 1);
  };

  const [message, setMessage] = useState({
    status: '',
    note: '',
  });

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log(form, 'form');
  }, [form]);

  useEffect(() => {
    getUserData();
  }, []);

  const styleForMobile = {
    width: '100%',
    position: 'relative',
    right: '35px',
  };
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 600;

  console.log(isMobile, 'ismobile');

  return (
    <>
      {user?.role === 'admin' && (
        <Stepper alternativeLabel activeStep={activeStep} style={isMobile ? styleForMobile : {}}>
          {steps.map((step, index) => {
            const labelProps = {};
            const stepProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step {...stepProps} key={index}>
                <StepLabel {...labelProps}>{step}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
      {user?.role === 'coordinator' && (
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps2.map((step, index) => {
            const labelProps = {};
            const stepProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step {...stepProps} key={index}>
                <StepLabel {...labelProps}>{step}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={message.status} sx={{ width: '100%' }}>
          {message.note}
        </Alert>
      </Snackbar>

      {activeStep === steps.length ? (
        <Typography variant="h3" align="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          All steps completed - New lead created successfully.
        </Typography>
      ) : (
        <>
          <form>
            {getStepContent(
              activeStep,
              form,
              setForm,
              user,
              displayFinish,
              setDisplayFinish,
              handleFinish,
              leadUploadId,
              setLeadUploadId,
              setMessage,
              message,
              setOpen,
              isValid,
              setIsValid
            )}
          </form>
          <Container
            style={{
              marginTop: '20px',
            }}
          >
            <Button className="button" disabled={activeStep === 0} onClick={handleBack}>
              back
            </Button>

            {user?.role === 'admin' ? (
              activeStep === steps.length - 1 ? (
                <></>
              ) : (
                <Button
                  className="button"
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
                  sx={{
                    marginLeft: '10px',
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              )
            ) : activeStep === steps2.length - 1 ? (
              <></>
            ) : (
              <Button
                className="button"
                variant="contained"
                color="primary"
                onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
                sx={{
                  marginLeft: '10px',
                }}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            )}
          </Container>
        </>
      )}
    </>
  );
};

export default LinearStepper;

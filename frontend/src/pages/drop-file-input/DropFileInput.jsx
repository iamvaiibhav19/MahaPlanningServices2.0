import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './drop-file-input.css';
import CircularProgress from '@mui/material/CircularProgress';
import { ImageConfig } from './ImageConfig';
import uploadImg from './uploadIcon.png';
import { Alert, Button, Container, Snackbar } from '@mui/material';
import axios from 'axios';
const { useNavigate } = require('react-router-dom');

const DropFileInput = (props) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const { form, setForm, leadId, getLeads, setOpenDocModal } = props;
  console.log(form, 'form');

  const [fileList, setFileList] = useState([]);

  const [value, setValue] = useState(false);

  const onDragEnter = () => wrapperRef.current.classList.add('dragover');

  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

  const onDrop = () => wrapperRef.current.classList.remove('dragover');

  const [uploadAnother, setUploadAnother] = useState(false);

  const [addAnother, setAddAnother] = useState(false);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [formId, setFormId] = useState('');

  const handleAnotherDoc = () => {
    const formData = new FormData();
    setValue(true);
    formData.append('file', fileList[0]);

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/v1/lead/upload/${leadId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res, 'res');
        setMessage({
          status: 'success',
          note: 'File uploaded successfully',
        });
        setValue(false);
        setOpen(true);
        setUploadAnother(false);
        setAddAnother(true);
        setFileList([]);
        getLeads();
      })
      .catch((err) => {
        console.log(err, 'err');
        setMessage({
          status: 'error',
          note: 'File upload failed',
        });

        setOpen(true);
      });
  };

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    console.log(newFile, 'newFile');
    if (newFile) {
      const updatedList = [newFile];
      setFileList(updatedList);
      const formData = new FormData();
      formData.append('file', newFile);
      console.log(formData, 'formData');
      axios.post(`${process.env.REACT_APP_BASE_URL}/upload`, formData).then((res) => {
        console.log(res, 'res');
        props.onFileChange(updatedList);
      });
    }
  };

  const fileRemove = (file) => {
    console.log(file, 'file');
    const filename = file.name;
    axios.post(`${process.env.REACT_APP_BASE_URL}/remove`, { filename }).then((res) => {
      console.log(res, 'res');
    });
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  const handleUploadFinish = () => {
    setValue(true);
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('lead', JSON.stringify(form));
    console.log(formData, 'formData');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
      headers: {
        token: token,
      },
    };
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/v1/lead/doc/new`, formData, config)
      .then((res) => {
        console.log(res, 'res');
        console.log(res.data.form._id, 'res.data.data');
        setFormId(res.data.form._id);
        setValue(false);
        setMessage({
          status: 'success',
          note: 'Lead Added Successfully',
        });
        setOpen(true);
        setFileList([]);
        setAddAnother(true);
      })
      .catch((err) => {
        console.log(err, 'err');
        setValue(false);
        setMessage({
          status: 'error',
          note: 'Something went wrong',
        });
        setOpen(true);
      });
  };

  return (
    <>
      {value ? (
        <CircularProgress />
      ) : addAnother ? (
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setAddAnother(false);
              setUploadAnother(true);
            }}
          >
            Add Another
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setAddAnother(false);
              setOpenDocModal(false);
              setForm({});
              setFileList([]);
              setOpen(false);
              setUploadAnother(false);
              setAddAnother(false);
            }}
            sx={{
              mt: 2,
            }}
          >
            Cancel
          </Button>
        </Container>
      ) : (
        <>
          <div
            ref={wrapperRef}
            className="drop-file-input"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <Container
              sx={{
                margin: 'auto',
              }}
            >
              <div className="drop-file-input__label">
                <Container
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <img
                    src={uploadImg}
                    alt=""
                    stye={{
                      width: '450px',
                      height: '100px',
                      border: '1px solid #ccc',
                    }}
                  />
                </Container>

                <p>Drag & Drop your files here</p>
              </div>
            </Container>
            <input type="file" value="" onChange={onFileDrop} />
          </div>
          {fileList.length > 0 ? (
            <div
              className="drop-file-preview"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p
                className="drop-file-preview__title"
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                Document to upload
              </p>
              {fileList.map((item, index) => (
                <div key={index} className="drop-file-preview__item">
                  <img
                    src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']}
                    alt=""
                    style={{
                      width: '50px',
                      height: '50px',
                    }}
                  />
                  <div className="drop-file-preview__item__info">
                    <p>{item.name}</p>
                  </div>
                  <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>
                    x
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          <Button
            variant="contained"
            sx={{ color: 'white', backgroundColor: '#3f51b5' }}
            onClick={handleAnotherDoc}
            disabled={fileList.length === 0}
            style={{
              margin: '20px auto',
            }}
          >
            {uploadAnother ? 'Upload More' : 'Upload'}
          </Button>
        </>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity={message.status} sx={{ width: '100%' }}>
          {message.note}
        </Alert>
      </Snackbar>
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;

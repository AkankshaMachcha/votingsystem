import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sha256 from 'crypto-js/sha256';
import { styled, useTheme } from '@mui/material/styles';
import SideNav from './SideNav';
import Box from '@mui/material/Box';
import '../../css/listcandidatescontainer.css';
import { storage, database } from '../../firebase/firebase';
import { getDownloadURL, ref as ref_storage, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { ref, push } from 'firebase/database';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AddCandidateContainer = () => {
  const [candidateData, setCandidateData] = useState({
    candidate_name: '',
    candidate_description: '',
    imgFile: null,
    symbolFile: null, // Store the uploaded image file
    email: ''
  });

  const handleChange = (e) => {
    if (e.target.name === 'imgFile' || e.target.name === 'symbolFile') {
      // Set the imgFile or symbolFile property to the uploaded file
      setCandidateData({ ...candidateData, [e.target.name]: e.target.files[0] });
    } else {
      // For other input fields, update the state normally
      const { name, value } = e.target;
      setCandidateData({ ...candidateData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (candidateData.imgFile && candidateData.symbolFile) {
        const imgRef = ref_storage(storage, "images/" + candidateData.imgFile.name);
        const symbolRef = ref_storage(storage, "symbols/" + candidateData.symbolFile.name);

        const uploadTask1 = uploadBytesResumable(imgRef, candidateData.imgFile);
        const uploadTask2 = uploadBytesResumable(symbolRef, candidateData.symbolFile);

        Promise.all([uploadTask1, uploadTask2]).then(async (snapshots) => {
          const imageUrl = await getDownloadURL(snapshots[0].ref);
          const symbolUrl = await getDownloadURL(snapshots[1].ref);

          // Add candidate data to Realtime Database along with image and symbol URLs
          const dbref = ref(database, 'candidates');
          push(dbref, {
            imageUrl: imageUrl,
            symbolUrl: symbolUrl,
            email: candidateData.email
          }).then(() => {

            try {
              const fileReader = new FileReader();
              fileReader.onload = () => {
                const imgHash = sha256(fileReader.result);

                const formData = new FormData();
                formData.append('candidate_name', candidateData.candidate_name);
                formData.append('candidate_description', candidateData.candidate_description);
                formData.append('imgHash', imgHash);
                formData.append('email', candidateData.email);

                axios.post('http://192.168.43.91:3001/candidate', formData, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }).then(response => {
                  console.log(response.data);

                  toast.success('Candidate added successfully');

                  setCandidateData({
                    candidate_name: '',
                    candidate_description: '',
                    imgFile: null,
                    symbolFile: null,
                    email: ''
                  });
                }).catch(error => {
                  console.error('Error adding candidate:', error);
                  toast.error('Failed to add candidate');
                });
              };

              fileReader.readAsText(candidateData.imgFile);
            } catch (error) {
              console.error('Error adding candidate:', error);
              toast.error('Failed to add candidate');
            }

          }).catch((error) => {
            console.error('Error adding candidate:', error);
            toast.error('Failed to add candidate');
          });
        }).catch((error) => {
          console.error('Error uploading files:', error);
          toast.error('Failed to upload files');
        });
      } else {
        alert("Please choose an image and a symbol for the profile");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <SideNav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div className="container">
          <h2 style={{ fontSize: '30px', fontWeight: '600', color: '#431C76', padding: '4vh' }}>Add Candidate</h2>
          <form onSubmit={handleSubmit} className='mx-auto formcandidateadd'>
            <div className="mb-3 rowi">
              <label htmlFor="candidate_name" className="form-label">Candidate Name:</label>
              <input
                type="text"
                id="candidate_name"
                name="candidate_name"
                className="form-control"
                value={candidateData.candidate_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 rowi">
              <label htmlFor="candidate_description" className="form-label">Candidate Description:</label>
              <textarea
                id="candidate_description"
                name="candidate_description"
                className="form-control"
                value={candidateData.candidate_description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3 rowi">
              <label htmlFor="imgFile" className="form-label">Upload Image:</label>
              <input
                type="file"
                id="imgFile"
                name="imgFile"
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 rowi">
              <label htmlFor="symbolFile" className="form-label">Upload Symbol:</label>
              <input
                type="file"
                id="symbolFile"
                name="symbolFile"
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 rowi">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={candidateData.email}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-register">Add Candidate</button>
          </form>
          <ToastContainer />
        </div>
      </Box>
    </Box>
  );
};

export default AddCandidateContainer;

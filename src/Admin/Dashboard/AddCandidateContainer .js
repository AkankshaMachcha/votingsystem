import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sha256 from 'crypto-js/sha256';  
import { styled, useTheme } from '@mui/material/styles';
import SideNav from './SideNav';
import Box from '@mui/material/Box';
import '../../css/listcandidatescontainer.css';

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
    imgFile: null, // Store the uploaded image file
    email: ''
  });

  const handleChange = (e) => {
    if (e.target.name === 'imgFile') {
      // Set the imgFile property to the uploaded image file
      setCandidateData({ ...candidateData, imgFile: e.target.files[0] });
    } else {
      // For other input fields, update the state normally
      const { name, value } = e.target;
      setCandidateData({ ...candidateData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generate hash code for the uploaded image file
      const imgHash = sha256(candidateData.imgFile);

      // Create form data object to send to server
      const formData = new FormData();
      formData.append('candidate_name', candidateData.candidate_name);
      formData.append('candidate_description', candidateData.candidate_description);
      formData.append('imgHash', imgHash);
      formData.append('email', candidateData.email);

      const response = await axios.post('http://192.168.43.91:3001/candidate', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      // Show success toast
      toast.success('Candidate added successfully');
      // Reset form data
      setCandidateData({
        candidate_name: '',
        candidate_description: '',
        imgFile: null,
        email: ''
      });
    } catch (error) {
      console.error('Error adding candidate:', error);
      // Show error toast
      toast.error('Failed to add candidate');
      // Add error handling logic here
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

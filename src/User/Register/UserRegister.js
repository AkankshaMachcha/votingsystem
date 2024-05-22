import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { database, storage } from '../../firebase/firebase';
import { ref, push, get, child } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../../css/userregister.css';
import * as faceapi from 'face-api.js';

const UserRegister = () => {
  const [fullName, setFullName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adharNo, setAdharNo] = useState('');
  const [age, setAge] = useState('');
  const [capturedImage, setCapturedImage] = useState(null); // State to store captured image
  const navigate = useNavigate();

  const loginUser = () => {
    navigate('/voter-login');
  };

  const handleRegister = async () => {
    // Validate form fields
    if (!fullName || !mobileNo || !email || !password || !confirmPassword || !adharNo || !username || !age) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format.');
      return;
    }

    // Validate mobile number format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNo)) {
      toast.error('Invalid mobile number format.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // Check if Aadhar number exists in adhardetails database
    const adharDetailsRef = ref(database, 'adhardetails');
    const adharSnapshot = await get(adharDetailsRef);

    if (!adharSnapshot.exists()) {
      toast.error('Aadhar number does not exist.');
      return;
    }

    let adharDetails = null;

    adharSnapshot.forEach((childSnapshot) => {
      const adharData = childSnapshot.val();
      if (adharData.adharNo === adharNo) {
        adharDetails = adharData;
        return;
      }
    });

    if (!adharDetails) {
      toast.error('Aadhar number does not exist.');
      return;
    }

    // Validate name, mobile number, and age
    const fullNameUpper = fullName;

    if (adharDetails.name !== fullNameUpper) {
      toast.error('Invalid details. Name is not Matching with Adhar details.');
      return;
    }
    if (adharDetails.phoneNo !== mobileNo) {
      toast.error('Invalid details. Mobile no is not Matching with Adhar details.');
      return;
    }
    const ageInt = parseInt(age);
    if (adharDetails.age !== ageInt) {
      toast.error('Invalid details. age is not Matching with Adhar details.');
      return;
    }

    // Create voter object
    try {
      // Capture facial features
      const facialFeatures = await captureFacialFeatures();

      // Create voter object with facial features URL
      const voter = {
        fullName: fullName,
        mobileNo: mobileNo,
        username: username,
        email: email,
        password: password,
        adharNo: adharNo,
        age: age,
        facialFeatures: facialFeatures,
      };

      // Push the new voter data to the database
      const votersRef = ref(database, 'voters');
      await push(votersRef, voter);

      // Show success message
      toast.success('Registration successful!');

      // Clear form fields after successful registration
      setFullName('');
      setMobileNo('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAdharNo('');
      setAge('');
      
      // Remove captured image after 3 seconds
      setTimeout(() => {
        setCapturedImage(null);
      }, 3000);
    } catch (error) {
      console.error('Error registering voter:', error);
      toast.error('Failed to register voter. Please try again later.');
    }
  };

  const captureFacialFeatures = async () => {
    try {
      // Load face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  
      // Request permission to access the camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  
      // Create video element
      const video = document.createElement('video');
      document.body.appendChild(video);
      video.style.display = 'none';
      video.srcObject = stream;
      await video.play();
  
      // Create canvas element for drawing image
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
  
      // Draw the current frame from the video onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Set captured image to display on UI
      setCapturedImage(canvas.toDataURL('image/png'));
  
      // Stop video stream
      stream.getTracks().forEach(track => track.stop());
      document.body.removeChild(video);
  
      // Detect facial landmarks from the captured image
      const detections = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
  
      if (detections) {
        // Extract facial landmark positions
        const landmarkPositions = detections.landmarks._positions;
  
        // Convert to JSON format
        const jsonResult = JSON.stringify({ landmarks: landmarkPositions });
  
        return jsonResult;
      } else {
        throw new Error('No face detected');
      }
    } catch (error) {
      console.error('Error capturing facial features:', error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  };

  return (
    <div className='container-fluid main-container'>
      <div className='row'>
        <div className='col-md-4 col-sm-12 left-container d-flex flex-column justify-content-center align-items-center p-4' style={{ color: 'white', fontSize: '1.2rem' }}>
          <p style={{ fontSize: '4vh', fontWeight: '800', }}>Already have an Account?</p>
          <p style={{ fontSize: '20px', padding: '4vh' }}>Explore more features by signing up for an account. Unlock exclusive features by logging in as a voter.</p>
          <button onClick={loginUser} className="btn btn-primary" style={{ backgroundColor: 'white', color: '#431c76', border: 'none', fontSize: '3vh', fontWeight: '600', padding: '2vh' }}>Login</button>
        </div>

        <div className='col-md-8 col-sm-8'>
          <div className="container mt-5 registermain">
            <h2 className='maintextr'> Registration</h2>
            <div className='maintextp'>
              <p className='childtext'>Register as a voter to participate in elections, make your voice heard.</p>
              <p className='childtext'>Unlock exclusive features by logging in as a voter.</p>
            </div>
            <ToastContainer />
            <Form>
              <div className='row rowi'>
                <div className='col-md-4 col-sm-8'>
                  <Form.Group controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className='col-md-4 col-sm-8'>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className='col-md-4 col-sm-8'>
                  <Form.Group controlId="mobileNo">
                    <Form.Label>Mobile No</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter mobile no"
                      value={mobileNo}
                      onChange={e => setMobileNo(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className='row rowi'>
                <div className='col-md-6 col-sm-8'>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className='col-md-6 col-sm-8'>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className='row rowi'>
                <div className='col-md-6 col-sm-8'>
                  <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className='col-md-6 col-sm-8'>
                  <Form.Group controlId="age">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter age"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className='row rowi'>
                <Form.Group controlId="adharNo">
                  <Form.Label>Aadhar No</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Aadhar no"
                    value={adharNo}
                    onChange={e => setAdharNo(e.target.value)}
                  />
                </Form.Group>
              </div>
              <Button variant="primary" onClick={handleRegister} className='btn btn-register'>
                Register
              </Button>
            </Form>
            {capturedImage && (
              <div className="mt-3">
                <img src={capturedImage} alt="Captured Image" style={{ width: '100%', maxWidth: '300px' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;

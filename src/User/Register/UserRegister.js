import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { database } from '../../firebase/firebase';
import { ref, push } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../../css/userregister.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const UserRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adharNo, setAdharNo] = useState('');
  const navigate = useNavigate();


  const loginUser = () => {
    navigate('/voter-login');
  }
  const handleRegister = () => {
    console.log('Registering voter:', {
      firstName,
      lastName,
      mobileNo,
      username,
      email,
      password,
      adharNo,
    });
    // Validate form fields
    if (!firstName || !lastName || !mobileNo || !email || !password || !confirmPassword || !adharNo || !username) {
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

    // Create voter object
    const voter = {
      firstName,
      lastName,
      mobileNo,
      username,
      email,
      password,
      adharNo,
    };

    // Get a reference to the 'voters' node in the database
    const votersRef = ref(database, 'voters');

    // Push the new voter data to the database
    push(votersRef, voter)
      .then(() => {
        navigate('/voter-login');
        toast.success('Registration successful!');
        console.log('Registration successful!');
        // Clear form fields after successful registration
        setFirstName('');
        setUsername('');
        setMobileNo('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAdharNo('');
        
      })
      .catch(error => {
        console.error('Error registering voter:', error);
        toast.error('Failed to register voter. Please try again later.');
      });
  };

  return (

    <div className='container-fluid main-container'>
      <div className='row'>
        
        <div className='col-4 left-container d-flex flex-column justify-content-center align-items-center p-4' style={{ color: 'white', fontSize: '1.2rem' }}>
       
          <p style={{ fontSize: '4vh', fontWeight: '800', }}>Already have an Account?</p>
          <p style={{ fontSize: '20px', padding: '4vh' }}>Explore more features by signing up for an account. Unlock exclusive features by logging in as a voter.</p>
          <button onClick={loginUser} className="btn btn-primary" style={{ backgroundColor: 'white', color: '#431c76', border: 'none', fontSize: '3vh', fontWeight: '600', padding: '2vh' }}>Login</button>
        </div>



        <div className='col-8'>
          <div className="container mt-5 registermain">
            <h2 className='maintextr'>Registration</h2>
            <div className='maintextp'>
              <p className='childtext'>Register as a voter to participate in elections , make your voice heard. </p>
              <p className='childtext'>Unlock exclusive features by logging in as a voter.</p>
            </div>
            <ToastContainer />
            <Form>
              <div className='row rowi'>
                <div className='col-4'>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className='col-4'>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className='col-4'>
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
              </div>

              <div className='row rowi'>

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
              <div className='row rowi'>
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

              <div className='row rowi'>
                <div className='col-6'>
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
                <div className='col-6'>
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
              </div>


              <div className='row rowi'>
                <Form.Group controlId="adharNo">
                  <Form.Label>Adhar No</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Adhar no"
                    value={adharNo}
                    onChange={e => setAdharNo(e.target.value)}
                  />
                </Form.Group>
              </div>
              <Button variant="primary" onClick={handleRegister} className='btn btn-register'>
                Register
              </Button>
            </Form>

          </div>

        </div>
      </div>
    </div>
  );
};

export default UserRegister;

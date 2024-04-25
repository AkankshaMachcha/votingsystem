import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { database } from '../../firebase/firebase';
import { ref, get, orderByChild } from 'firebase/database';
import { signInWithPhoneNumber, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook for navigation
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/userregister.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const UserLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const reisterredirect =()=>{
    navigate('/voter-register');
  }
  const handleLogin = () => {
    // Get a reference to the 'voters' node in the database
    const votersRef = ref(database, 'voters');


    // Read the data once
    get(votersRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          // Loop through each child node
          snapshot.forEach(childSnapshot => {
            const user = childSnapshot.val();
            const userId = childSnapshot.key;
            // Check if the entered mobile number matches the stored mobile number
            if (user.mobileNo === phoneNumber) {
              // Check if the entered password matches the stored password
              if (user.password === password) {
                toast.success('Login successful!');
                // Redirect to another page with the user's ID in the URL
                // Replace 'profile' with the desired URL path
                navigate(`/vote/${userId}`);
                return; // Exit the loop once user is found
              } else {
                toast.error('Invalid password. Please try again.');
                return; // Exit the loop if password is incorrect
              }
            }
          });
          // If no user with matching mobile number is found
          toast.error('User not found. Please check your phone number.');
        } else {
          toast.error('No users found in the database.');
        }
      })
      .catch(error => {
        toast.error('Failed to login. Please try again later.');
        console.error('Error logging in:', error);
      });
  };

  return (
    //   <div className="container mt-5">
    //   <Toaster />
    //   <h2>User Login</h2>
    //   <Form>

    //     </Form.Group>

    //       Login
    //     </Button>
    //   </Form>
    // </div>
    <div className='container-fluid main-container'>
      <div className='row'>

        <div className='col-7'>
        <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate('/')} className="back-icon mt-3" />
          <div className="container loginmain">
          
  
            <h2 className='maintextr maintextrl'>Login</h2>
            <p className='childtext childtextl'>Log in as a voter to cast your vote and make your voice heard.</p>
     
            <Form className='forml'>
              <div className='row rowi'>
                <Form.Group controlId="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className='row rowi'>
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


              <Button variant="primary" onClick={handleLogin} className='btn btn-register btnl'>Login</Button>

            </Form>
          </div>
        </div>
        <div className='col-5 left-container d-flex flex-column justify-content-center align-items-center p-4' style={{ color: 'white', fontSize: '1.2rem' }}>
          <ToastContainer />
          <p style={{ fontSize: '4vh', fontWeight: '800', }}>Dont have an Account?</p>
          <p style={{ fontSize: '20px', padding: '4vh' }}>Unlock more features by signing up for an account. Get access to exclusive features as a registered voter</p>
          <button onClick={reisterredirect} className="btn btn-primary" style={{ backgroundColor: 'white', color: '#431c76', border: 'none', fontSize: '3vh', fontWeight: '600', padding: '2vh' }}>Register</button>
        </div>
      </div>
    </div>

  );
};

export default UserLogin;

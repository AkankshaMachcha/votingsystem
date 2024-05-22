import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { database, auth } from '../../firebase/firebase';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/userregister.css';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const UserLogin = () => {
  const [adharNo, setAdharNo] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUpRecaptcha();
  }, []);

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
  };

  const handleLogin = async () => {
    console.log("Attempting to login with Aadhar number:", adharNo);
    try {
      const votersRef = ref(database, 'voters');
      const snapshot = await get(votersRef);
  
      if (snapshot.exists()) {
        let userFound = false; // Flag to track if user is found
  
        snapshot.forEach(childSnapshot => {
          const voter = childSnapshot.val();
          if (voter.adharNo === adharNo) {
            const mobileNo = voter.mobileNo;
            console.log("Sending OTP to mobile number:", mobileNo);
            setUserId(childSnapshot.key); // Set the user ID
            sendOTP(mobileNo);
            userFound = true; // Set flag to true if user is found
            return; // Exit the loop once user is found
          }
        });
  
        if (!userFound) {
          toast.error('User not found. Please check your Aadhar number.');
        }
      } else {
        toast.error('No users found in the database.');
      }
    } catch (error) {
      console.error('Error logging in as user:', error);
      toast.error('Failed to log in. Please try again later.');
    }
  };
  

  const sendOTP = async (mobileNo) => {
    if (!mobileNo) {
      console.error("Invalid mobile number");
      return;
    }

    if (!window.recaptchaVerifier) {
      setUpRecaptcha();
    }
    const ph = '+91' + mobileNo;
    try {
      const result = await signInWithPhoneNumber(
        auth,
        ph,
        window.recaptchaVerifier
      );
      setVerificationId(result.verificationId);
      setShowOTP(true);
      toast.success("OTP sent successfully");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const onVerify = async () => {
    if (!verificationId || !otp) {
      console.error("Invalid verification ID or OTP");
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      navigate(`/vote/${userId}`); // Navigate to the appropriate page with the user's ID
      toast.success("OTP verified successfully");
    } catch (error) {
      console.error("Error signing in with OTP:", error);
      toast.error('Failed to verify OTP. Please try again.');
    }
  };

  const reisterredirect = () => {
    navigate('/voter-register');
  };

  return (
    <div className='container-fluid main-container'>
      <div className='row'>
        <div className='col-md-7 col-sm-12'>
          <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate('/')} className="back-icon mt-3" />
          <div className="container loginmain">
            <h2 className='maintextr maintextrl'>Login</h2>
            <p className='childtext childtextl'>Log in as a voter to cast your vote and make your voice heard.</p>
            <Row className='loginmain_container'>
              <Col md={{ span: 6, offset: 3 }}>
                {!showOTP ? (
                  <Form>
                    <Form.Group controlId="adharNo">
                      <Form.Label>Aadhar Number</Form.Label>
                      <Form.Control
                        type="text"
                        style={{
                          margin:'3vh'
                        }}
                        placeholder="Enter Aadhar number"
                        value={adharNo}
                        onChange={(e) => setAdharNo(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={handleLogin} style={{background:'#080942'}}block>
                      Send OTP
                    </Button>
                  </Form>
                ) : (
                  <Form>
                    <Form.Group controlId="otp">
                      <Form.Label>OTP</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter OTP"
                        value={otp}
                        style={{
                          margin:'3vh'
                        }}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="success" onClick={onVerify} block>
                      Verify OTP
                    </Button>
                  </Form>
                )}
              </Col>
            </Row>
          </div>
        </div>
        <div className='col-md-5 col-sm-12 left-container d-flex flex-column justify-content-center align-items-center p-4' style={{ color: 'white', fontSize: '1.2rem' }}>
          <div id="recaptcha-container"></div>
          <ToastContainer />
          <p style={{ fontSize: '4vh', fontWeight: '800', }}>Don't have an Account?</p>
          <p style={{ fontSize: '20px', padding: '4vh' }}>Unlock more features by signing up for an account. Get access to exclusive features as a registered voter</p>
          <button onClick={reisterredirect} className="btn btn-primary" style={{ backgroundColor: 'white', color: '#431c76', border: 'none', fontSize: '3vh', fontWeight: '600', padding: '2vh' }}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

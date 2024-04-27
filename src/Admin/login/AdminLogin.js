import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { database, auth } from '../../firebase/firebase';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/adminlogin.css';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from 'firebase/auth';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [showOTP, setShowOTP] = useState(false);
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
    try {
      const adminRef = ref(database, 'admin');
      const adminSnapshot = await get(adminRef);
      const adminData = adminSnapshot.val();

      if (adminData && adminData.username === username && adminData.password === password) {
        setShowOTP(true);
      } else {
        toast.error('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in as admin:', error);
      toast.error('Failed to log in as admin. Please try again later.');
    }
  };

  const onSendOtp = async () => {
    if (!phoneNumber) {
      console.error("Invalid phone number");
      return;
    }

    if (!window.recaptchaVerifier) {
      setUpRecaptcha();
    }
    const ph = '+91' + phoneNumber;
    try {
      const result = await signInWithPhoneNumber(
        auth,
        `${ph}`,
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
      navigate('/admin/dashboard/list-candidates');
      toast.success("OTP verified successfully");
    } catch (error) {
      console.error("Error signing in with OTP:", error);
      toast.error('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <Container fluid className="maincontaineral">
      <div id="recaptcha-container"></div>
      <ToastContainer />
      <Row className='loginmaincontainer'>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="text-center">Admin Login</h2>
          {!showOTP ? (
            <Form>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleLogin} block>
                Login
              </Button>
            </Form>
          ) : (
            <Form>
              <Form.Group controlId="phoneNo">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={onSendOtp} block>
                Send OTP
              </Button>
              <Form.Group controlId="otp">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter OTP"
                  value={otp}
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
    </Container>
  );
};

export default AdminLogin;

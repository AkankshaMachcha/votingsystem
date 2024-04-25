import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { database } from '../../firebase/firebase';
import { ref, get, child } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/adminlogin.css';


const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const adminRef = ref(database, 'admin');
      const adminSnapshot = await get(adminRef); // Fetch the entire admin object
      const adminData = adminSnapshot.val();

      if (adminData && adminData.username === username && adminData.password === password) {
        // Admin login successful
        toast.success('Admin login successful!');
        navigate('/admin/dashboard/list-candidates'); // Navigate to admin dashboard
      } else {
        // Admin login failed
        toast.error('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in as admin:', error);
      toast.error('Failed to log in as admin. Please try again later.');
    }
  };

  return (
    <div className="maincontaineral w-100">
      <ToastContainer />
      <div className='loginmaincontainer'>
        <h2>Admin Login</h2>

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
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AdminLogin;

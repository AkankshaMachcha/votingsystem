import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';
import admin from './images/admin.png';
import voter from './images/voter.png';

const Login = () => {
    const navigate = useNavigate();

    const loginAsAdmin = () => {
        // Navigate to the admin login page
        navigate('/admin-login');
    };

    const loginAsVoter = () => {
        // Navigate to the voter login page
        navigate('/voter-register');
    };

    return (
        <div className="container main-container text-center">
            <div className='maintext'>
                <p className='maintextp'>Choose your role to login</p>
                <p>Login as an admin to manage the election process or login as a voter to cast your vote.</p>
            </div>
            <div className="row w-100 text-center main">
                <div className="col-md-5" onClick={loginAsAdmin}>
                    <div className='child-container'>
                        <img src={admin} alt="Admin Icon" className="img-fluid mb-3" style={{ maxWidth: '200px', marginTop: '3vh' }} />
                        <p>Admin</p>
                    </div>

                </div>
                <div className="col-md-5" onClick={loginAsVoter}>
                    <div className=' child-container'>
                        <img src={voter} alt="Voter Icon" className="img-fluid mb-3" style={{ maxWidth: '200px', marginTop: '3vh' }} />
                        <p>Voter</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;

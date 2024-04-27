import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SideNavUser from './SideNavUser';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { ref, get, storage, database , update} from '../../firebase/firebase';
import '../../css/userregister.css';


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Profile = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState({});
    const [newDetails, setNewDetails] = useState({});

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userRef = ref(database, `voters/${userId}`);
                const snapshot = await get(userRef);
                const userData = snapshot.val();
                setUserDetails(userData);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                toast.error('Failed to fetch user details');
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleChange = (e) => {
        setNewDetails({
            ...newDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userRef = ref(database, `voters/${userId}`);
            await update(userRef, newDetails);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        }
    };

   
  
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <SideNavUser userId={userId} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <ToastContainer />
                <div>
                    <h2>Profile</h2>
                    <Form onSubmit={handleSubmit} className='container-md container-lg container-sm'>

                        <div className='rowi'>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                name="firstName"
                                value={newDetails.firstName || userDetails.firstName || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        </div>
                        <div className='rowi'>
                        <Form.Group controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                name="lastName"
                                value={newDetails.lastName || userDetails.lastName || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        </div>
                        <div className='rowi'>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={newDetails.email || userDetails.email || ''}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                        </div>
                        <div className='rowi'>
                        <Form.Group controlId="formMobileNo">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter mobile number"
                                name="mobileNo"
                                value={newDetails.mobileNo || userDetails.mobileNo || ''}
                                onChange={handleChange}
                                disabled // Disable mobile number field
                            />
                        </Form.Group>
                        </div>
                      
                        
                       
                        <Button variant="primary" type="submit" className='btn btn-register'>
                            Update Profile
                        </Button>
                    </Form>
                    
                    
                </div>
            </Box>
        </Box>
    );
};

export default Profile;

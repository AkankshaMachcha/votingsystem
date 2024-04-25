import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { database } from '../../firebase/firebase';
import { ref, get } from 'firebase/database';
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


const AddElectionContainer = () => {
    const [electionName, setElectionName] = useState('');
    const [electionDescription, setElectionDescription] = useState('');
    const [adminEmail, setAdminEmail] = useState('');

    useEffect(() => {
        const fetchAdminEmail = async () => {
            try {
                const adminRef = ref(database, 'admin');
                const adminSnapshot = await get(adminRef);
                if (adminSnapshot.exists()) {
                    const adminData = adminSnapshot.val();
                    setAdminEmail(adminData.email);
                } else {
                    console.error('Admin data not found');
                }
            } catch (error) {
                console.error('Error fetching admin email:', error);
            }
        };

        fetchAdminEmail();
    }, []);

    const baseURL = 'http://192.168.43.91:3001/election';
    const handleAddElection = async () => {
        if (!adminEmail) {
            toast.error('Admin email not found. Please try again later.');
            return;
        }
        if (!electionName || !electionDescription) {
            toast.error('Please fill in all fields.');
            return;
        }

        const newElection = {
            email: adminEmail,
            election_name: electionName,
            election_description: electionDescription,
        };

        const headers = {
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post('http://192.168.43.91:3001/election', newElection, { headers });
            if (response.status === 201) {
                toast.success('Election added successfully!');
                setElectionName('');
                setElectionDescription('');
            } else {
                toast.error('Failed to add election. Please try again later.');
            }
        } catch (error) {
            console.error('Error adding election:', error);
            toast.error('Failed to add election. Please try again later.');
        }
    };

    return (


        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <SideNav />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />

                <div>
                    <h2 style={{ fontSize: '30px', fontWeight: '600', color: '#431C76', padding: '4vh' }}>Add Election</h2>
                    <Form  className='mx-auto formcandidateadd'>
                        <div className='row rowi'>
                        <Form.Group controlId="electionName ">
                            <Form.Label>Election Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter election name"
                                value={electionName}
                                onChange={e => setElectionName(e.target.value)}
                            />
                        </Form.Group>
                        </div>
                        <div className='rowi'>
                        <Form.Group controlId="electionDescription">
                            <Form.Label>Election Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter election description"
                                value={electionDescription}
                                onChange={e => setElectionDescription(e.target.value)}
                            />
                        </Form.Group>
                        </div>
                      
                        <Button variant="primary" className='btn btn-register' onClick={handleAddElection}>
                            Add Election
                        </Button>
                    </Form>
                </div>
            </Box>
        </Box>
    );
};

export default AddElectionContainer;

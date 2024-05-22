import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { database } from '../../firebase/firebase';
import { ref, get } from 'firebase/database';
import { Card, Button } from 'react-bootstrap';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SideNavUser from './SideNavUser';
import { Container, Row, Col } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { BarChart, PieChart } from './ResultsCharts'; // Importing the charts

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const WatchResults = () => {
    const { userId } = useParams();
    const [winner, setWinner] = useState({});
    const [closed, setClosed] = useState(false);
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        // Fetch election result
        const fetchElectionResult = async () => {
            const email = 'example@example.com'; // Replace with the email of the user
            try {
                const response = await axios.get(`http://192.168.43.91:3001/election/result/${email}`);
                const { winner, candidates } = response.data;

                if (winner && Array.isArray(winner) && winner.length > 0) {
                    setWinner(winner[0]); // Winner is an array, so get the first element
                } else {
                    console.log('No winner found in the response');
                }

                if (candidates && Array.isArray(candidates)) {
                    setCandidates(candidates);
                }
            } catch (error) {
                console.error('Failed to fetch election result:', error);
            }
        };

        fetchElectionResult();

        // Fetch election status (closed or not)
        const electionRef = ref(database, 'election');
        get(electionRef).then((snapshot) => {
            const closedValue = snapshot.val()?.closed;
            if (closedValue === 'yes') {
                setClosed(true);
            }
        });
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <SideNavUser userId={userId} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <ToastContainer />
                <Container>
                    <Row>
                        <Col>
                            <h2 style={{ fontSize: '30px', fontWeight: '600', color: '#431C76', padding: '4vh' }}>Results</h2>
                            {closed ? (
                                winner ? (
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#431C76', padding: '4vh' }}>Winner Details:</h3>
                                        <Card style={{ width: '50%', marginLeft: '5vh', marginTop: '2vh', padding: '2vh', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item style={{ fontWeight: 'bold', borderBottom: '1px solid #ced4da', paddingBottom: '0.5rem' }}>Name: <b>{winner[0]}</b></ListGroup.Item>
                                                <ListGroup.Item style={{ borderBottom: '1px solid #ced4da', paddingBottom: '0.5rem' }}>Description: {winner[1]}</ListGroup.Item>
                                                <ListGroup.Item style={{ borderBottom: '1px solid #ced4da', paddingBottom: '0.5rem' }}>Email: {winner[4]}</ListGroup.Item>
                                            </ListGroup>
                                        </Card>
                                    </div>
                                ) : (
                                    <p>No winner found.</p>
                                )
                            ) : (
                                <p>Election results will be available after the election is closed.</p>
                            )}
                        </Col>
                    </Row>
                </Container>
                {/* Render charts */}
                <Container>
                    <Row>
                        <Col>
                            {closed && candidates && candidates.length > 0 && (
                                <>
                                    <h3 className='mt-4'>Results Chart</h3>
                                    <div className='row'>
                                        <div className='col-md-6 col-sm-12'>
                                          <BarChart candidates={candidates} /> {/* Pass candidates array */}
                                        </div>
                                        <div className='col-md-6 col-sm-12'>
                                            <PieChart candidates={candidates} /> {/* Pass candidates array */}
                                        </div>
                                    </div>
                                   
                                </>
                            )}
                        </Col>
                    </Row>
                </Container>
            </Box>
        </Box>
    );
};

export default WatchResults;

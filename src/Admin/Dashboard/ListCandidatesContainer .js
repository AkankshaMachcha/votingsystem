import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { styled, useTheme } from '@mui/material/styles';
import SideNav from './SideNav';
import Box from '@mui/material/Box';
import { Card, Container, Row, Col } from 'react-bootstrap';
import '../../css/listcandidatescontainer.css';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


const ListCandidatesContainer = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://192.168.43.91:3001/candidates');
        setCandidates(response.data.candidates);
      } catch (error) {
        console.error('Failed to fetch candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  return (

    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <SideNav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container>
          <h2 style={{ fontSize: '30px', fontWeight: '600', color: '#431C76', padding: '4vh' }}>Candidate Details</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {candidates.map((candidate, index) => (
              <Col key={index}>
                <Card className='cardm'>
                  {/* <Card.Img src={`http://192.168.43.91:3001/candidates/images/${candidate['2']}`} alt={`Image of ${candidate['0']}`} /> */}
                  <Card.Body>
                    <Card.Title className="bold-text">{candidate['0']}</Card.Title>
                    <Card.Text className="description-text">Description: {candidate['1']}</Card.Text>
                    <Card.Text className="email-text">Email: {candidate['4']}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        
        </Container>
      </Box>
    </Box>
  );
};

export default ListCandidatesContainer;

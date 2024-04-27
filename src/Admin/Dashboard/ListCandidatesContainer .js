import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/firebase'; // Assuming you have initialized Firebase
import { styled, useTheme } from '@mui/material/styles';
import SideNav from './SideNav';
import Box from '@mui/material/Box';
import { Card, Container, Row, Col } from 'react-bootstrap';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const IconImage = styled('img')({
  width: '30px', // Adjust width as needed
  height: '30px', // Adjust height as needed
  marginRight: '10px', // Adjust margin as needed
});

const DescriptionText = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <div onClick={toggleExpansion}>
      <Card.Text className="description-text" style={{ display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', cursor: 'pointer' }}>
        Description: {description}
      </Card.Text>
    </div>
  );
};

const ListCandidatesContainer = () => {
  const [matchedCandidates, setMatchedCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Fetch candidates from Firebase
        const firebaseCandidatesRef = ref(database, 'candidates');
        const firebaseCandidatesSnapshot = await get(firebaseCandidatesRef);
        const firebaseCandidates = firebaseCandidatesSnapshot.val();

        // Fetch candidates from the API
        const apiResponse = await axios.get('http://192.168.43.91:3001/candidates');
        const apiCandidates = apiResponse.data.candidates;

        // Match candidates based on email
        const matchedCandidates = [];

        for (const firebaseCandidateKey in firebaseCandidates) {
          if (firebaseCandidates.hasOwnProperty(firebaseCandidateKey)) {
            const firebaseCandidate = firebaseCandidates[firebaseCandidateKey];

            // Find matching API candidate by email
            const matchingApiCandidate = apiCandidates.find(apiCandidate => apiCandidate[4] === firebaseCandidate.email);

            // If a match is found, add to the matchedCandidates array
            if (matchingApiCandidate) {
              matchedCandidates.push({
                name: matchingApiCandidate[0],
                description: matchingApiCandidate[1],
                email: matchingApiCandidate[4],
                imageUrl: firebaseCandidate.imageUrl,
                symbolUrl: firebaseCandidate.symbolUrl,
              });
            }
          }
        }

        console.log(matchedCandidates);
        setMatchedCandidates(matchedCandidates);
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
            {matchedCandidates.map(candidate => (
              <Col key={candidate.email} xs={12} sm={6} md={4}>
                <Card className='cardm'>
                  <Card.Body className='m-0 p-0'>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '0' }}>
                      {candidate.symbolUrl && <IconImage src={candidate.symbolUrl} className='imgicon' alt={`Symbol of ${candidate.name}`} />}
                      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                        <Card.Title className="bold-text">{candidate.name}</Card.Title>
                      </div>
                    </div>

                    <hr />
                    {candidate.imageUrl && <Card.Img src={candidate.imageUrl} alt={`Image of ${candidate.name}`} />}
                    <div style={{ marginTop: '1vh' }}>
                      <DescriptionText description={candidate.description} />
                      <Card.Text className="email-text">Email: {candidate.email}</Card.Text>
                    </div>

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

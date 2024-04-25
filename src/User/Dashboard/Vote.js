import { useEffect, useState } from 'react';
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
import '../../css/listcandidatescontainer.css';
import { Container, Row, Col } from 'react-bootstrap';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Vote = () => {
  const { userId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [electionClosed, setElectionClosed] = useState(false);

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

  useEffect(() => {
    const fetchUserEmail = async (userId) => {
      try {
        const voterRef = ref(database, `voters/${userId}`);
        const snapshot = await get(voterRef);
        const userData = snapshot.val();

        if (userData) {
          console.log('User Email:', userData.email);
          setUserEmail(userData.email);
        } else {
          console.error('User data not found for userId:', userId);
          toast.error('User data not found');
        }
      } catch (error) {
        console.error('Failed to fetch user email:', error);
        toast.error('Failed to fetch user email');
      }
    };

    fetchUserEmail(userId);
  }, [userId]);

  useEffect(() => {
    // Fetch the closed value from the Firebase database
    const electionRef = ref(database, 'election');
    get(electionRef).then((snapshot) => {
      const closedValue = snapshot.val()?.closed;
      if (closedValue === 'yes') {
        setElectionClosed(true);
      }
    });
  }, []);

  const handleVote = async (candidateID) => {
    try {
      const data = {
        candidateID: candidateID,
        email: userEmail
      };

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      await axios.post('http://192.168.43.91:3001/vote', data, config);
      toast.success('Vote registered successfully');
    } catch (error) {
      console.error('Failed to register vote:', error);
      toast.error('Failed to register vote');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <SideNavUser userId={userId} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <ToastContainer />
        <div>
          {electionClosed ? (
            <p>Elections have been closed.</p>
          ) : (
            <Container>
              <h2 style={{ fontSize: '30px', fontWeight: '600', color: '#431C76', padding: '4vh' }}>Cast Vote</h2>
              <Row xs={1} md={2} lg={3} className="g-4">
                {candidates.map((candidate, index) => (
                  <Col key={index}>
                    <Card className='cardm'>
                      <Card.Body>
                        <Card.Title className="bold-text">{candidate['0']}</Card.Title>
                        <Card.Text className="description-text">Description: {candidate['1']}</Card.Text>
                        <Card.Text className="email-text">Email: {candidate['4']}</Card.Text>
                        <Button onClick={() => handleVote(index + 1)}>Vote</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default Vote;

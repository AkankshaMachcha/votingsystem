import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup } from 'react-bootstrap';
import { styled, useTheme } from '@mui/material/styles';
import SideNav from './SideNav';
import Box from '@mui/material/Box';
import '../../css/listcandidatescontainer.css';
import { ref, set, get } from 'firebase/database';
import { database } from '../../firebase/firebase';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmation dialog
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import confirmation dialog styles
import { toast } from 'react-toastify'; // Import toast notification
import 'react-toastify/dist/ReactToastify.css'; // Import toast notification styles

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const DeployVotesContainer = () => {
  const [electionDetails, setElectionDetails] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState({});
  const [closed, setClosed] = useState(false); // State to track if election is closed

  useEffect(() => {
    const fetchElectionResult = async () => {
      const email = 'example@example.com'; // Replace with the email of the user
      try {
        const response = await axios.get(`http://192.168.43.91:3001/election/result/${email}`);
        const { electionDetails, candidates, winner } = response.data;
        setElectionDetails(electionDetails);
        setCandidates(candidates);
        setWinner(winner[0]); // Winner is an array, so get the first element
      } catch (error) {
        console.error('Failed to fetch election result:', error);
      }
    };

    fetchElectionResult();

    // Check if election is closed
    const electionRef = ref(database, 'election');
    get(electionRef).then((snapshot) => {
      const closedValue = snapshot.val()?.closed;
      if (closedValue === 'yes') {
        setClosed(true);
      }
    });
  }, []);

  const handleElectionClose = () => {
    // Show confirmation dialog
    confirmAlert({
      title: 'Confirm',
      message: 'Are you sure you want to close the election?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            // Create a reference to the 'election' table in your Firebase database
            const electionRef = ref(database, 'election');
  
            // Set the 'closed' variable to 'yes'
            set(electionRef, { closed: 'yes' })
              .then(() => {
                console.log('Election closed successfully');
                // Show success toast
                toast.success('Election has been closed');
                // Update local state
                setClosed(true);
              })
              .catch((error) => {
                console.error('Error closing election:', error);
                // Show error toast
                toast.error('Failed to close election');
              });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <SideNav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />

        <div className='container'>
          <div className='d-flex justify-content-between'>
            <h2 style={{ fontSize: '30px', fontWeight: '600', color: '#431C76', padding: '4vh' }}>Results</h2>
            
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#431C76', padding: '4vh' }}>Winner Details:</h3>
          <Card style={{ width: '50%', marginLeft: '5vh', marginTop: '2vh', padding: '2vh', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <ListGroup variant="flush">
              <ListGroup.Item style={{ fontWeight: 'bold', borderBottom: '1px solid #ced4da', paddingBottom: '0.5rem' }}>Name: <b>{winner[0]}</b></ListGroup.Item>
              <ListGroup.Item style={{ borderBottom: '1px solid #ced4da', paddingBottom: '0.5rem' }}>Description: {winner[1]}</ListGroup.Item>
              <ListGroup.Item style={{ borderBottom: '1px solid #ced4da', paddingBottom: '0.5rem' }}>Email: {winner[4]}</ListGroup.Item>
            </ListGroup>
           
          </Card>
          <button className='btn btn-register m-3' style={{border:'1px solid #ced4da'}} onClick={handleElectionClose} disabled={closed}>Close Election</button>


          <p style={{ fontSize: '20px', color: '#431C76', marginTop: '4vh' }}>Candidates and their Vote Counts:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {candidates.map((candidate, index) => (
              <Card key={index} style={{ width: '18rem', marginTop: '20px', marginRight: '20px' }}>
                <Card.Body>
                  <Card.Title>{candidate[0]}</Card.Title>
                  <Card.Text>Vote Count: {candidate[3]}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
        <div>

        </div>
      </Box>
    </Box>
  );
};

export default DeployVotesContainer;

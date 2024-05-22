import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/firebase';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as faceapi from 'face-api.js';
import SideNavUser from './SideNavUser';
import Fingerprint2 from 'fingerprintjs2';


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

const Vote = () => {
  const { userId } = useParams();
  const [matchedCandidates, setMatchedCandidates] = useState([]);
  const [electionClosed, setElectionClosed] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedFeatures, setCapturedFeatures] = useState(null); // State to store captured facial features
  const [registrationComplete, setRegistrationComplete] = useState(false); // State to track registration completion
  const [apiCandidateOrder, setApiCandidateOrder] = useState([]); // Store the order of the API candidates
  const [userEmail, setUserEmail] = useState('');

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
    const fetchCandidates = async () => {
      try {
        // Fetch candidates from Firebase
        const firebaseCandidatesRef = ref(database, 'candidates');
        const firebaseCandidatesSnapshot = await get(firebaseCandidatesRef);
        const firebaseCandidates = firebaseCandidatesSnapshot.val();

        // Fetch candidates from the API
        const apiResponse = await axios.get('http://192.168.43.91:3001/candidates');
        const apiCandidates = apiResponse.data.candidates;

        // Store the order of the API candidates
        setApiCandidateOrder(apiCandidates.map(candidate => candidate[4])); // Assuming email is the unique identifier

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
                id: firebaseCandidateKey, // Store the Firebase candidate key as the ID
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

  useEffect(() => {
    // Fetch user registration status and facial features
    const fetchUserData = async () => {
      try {
        const voterRef = ref(database, `voters/${userId}`);
        const snapshot = await get(voterRef);
        const userData = snapshot.val();

        if (userData) {
          console.log('User Facial Features:', userData.facialFeatures);
          setCapturedFeatures(userData.facialFeatures);
          setRegistrationComplete(true); // Set registration complete flag
        } else {
          console.error('User data not found for userId:', userId);
          toast.error('User data not found');
        }
      } catch (error) {
        console.error('Failed to fetch user facial features:', error);
        toast.error('Failed to fetch user facial features');
      }
    };

    fetchUserData();
  }, [userId]);

  // const handleVote = async (candidateID) => {
  //   try {
     

  //     const data = { candidateID, userId };

  //     await axios.post('http://192.168.43.91:3001/vote', data, {
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //     toast.success('Vote registered successfully');

  //   } catch (error) {
  //     toast.error('Failed to capture facial features or register vote');
  //   }
  // };

  const handleFingerprintCapture = () => {
    toast.success('fingerprint detection');
    Fingerprint2.get(function (components) {
      const fingerprint = Fingerprint2.x64hash128(components.map(function (pair) { return pair.value }).join(), 31);
      console.log('Fingerprint:', fingerprint);
      
    });
  };

  const handleVote = async (candidateID) => {
    try {
      const features = await captureFacialFeatures();
      console.log('Captured Features:', features);
      toast.success('face detected , provide fingerprint');
      handleFingerprintCapture();
      toast.success('fingerprint validation complete');
      
      if (!registrationComplete) {
        toast.error('Please complete registration first.');
        return;
      }

     

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




  const captureFacialFeatures = async () => {
    try {
      // Load face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      console.log('Models loaded successfully');

      // Request permission to access the camera and capture a single frame
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera stream started');

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Wait for the video to load metadata and start playing
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // Create canvas element to capture the image
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      // Wait for the video to start playing
      await new Promise((resolve) => {
        video.onplaying = () => {
          resolve();
        };
      });

      // Draw the current frame from the video onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Frame drawn on canvas');

      // Stop the video stream
      stream.getTracks().forEach(track => track.stop());
      console.log('Camera stream stopped');

      // Set captured image to display on UI (optional, for debugging)
      setCapturedImage(canvas.toDataURL('image/png'));

      // Detect facial landmarks from the captured image
      const detections = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      console.log('Detections:', detections);

      if (detections) {
        // Extract facial landmark positions
        const landmarkPositions = detections.landmarks.positions.map(pos => ({ x: pos.x, y: pos.y }));
        console.log('Landmark positions:', landmarkPositions);

        // Convert to JSON format
        const jsonResult = JSON.stringify({ landmarks: landmarkPositions });

        return jsonResult;
      } else {
        throw new Error('No face detected');
      }
    } catch (error) {
      console.error('Error capturing facial features:', error);
      throw error;
    }
  };







  const calculateFeatureMatch = async (features1, features2) => {
    try {
      // Parse JSON format features to arrays
      const landmarks1 = JSON.parse(features1)?.landmarks;
      const landmarks2 = JSON.parse(features2)?.landmarks;

      // Validate the landmarks data
      if (!isValidLandmarks(landmarks1) || !isValidLandmarks(landmarks2)) {
        throw new Error('Invalid landmark coordinates');
      }

      // Convert landmarks arrays to faceapi.js Point objects
      const points1 = landmarks1.map(landmark => new faceapi.Point(landmark.x, landmark.y));
      const points2 = landmarks2.map(landmark => new faceapi.Point(landmark.x, landmark.y));

      // Compute Euclidean distance between the landmark points
      const distance = calculateEuclideanDistance(points1, points2);

      // Normalize distance to a similarity score between 0 and 1
      const similarity = 1 - Math.min(distance / 10, 1); // Assuming a maximum distance of 10 for similarity of 1

      return similarity;
    } catch (error) {
      console.error('Error calculating feature match:', error);
      throw error;
    }
  };

  const isValidLandmarks = (landmarks) => {
    return Array.isArray(landmarks) && landmarks.length > 0 && landmarks.every(landmark => isValidPoint(landmark));
  };

  const isValidPoint = (point) => {
    return point && typeof point.x === 'number' && typeof point.y === 'number' && !isNaN(point.x) && !isNaN(point.y);
  };

  const calculateEuclideanDistance = (points1, points2) => {
    try {
      if (points1.length !== points2.length) {
        throw new Error('Mismatched number of points');
      }

      let squaredSum = 0;
      for (let i = 0; i < points1.length; i++) {
        const dx = points1[i].x - points2[i].x;
        const dy = points1[i].y - points2[i].y;
        if (isNaN(dx) || isNaN(dy)) {
          throw new Error('Invalid landmark coordinates');
        }
        squaredSum += dx * dx + dy * dy;
      }

      return Math.sqrt(squaredSum);
    } catch (error) {
      console.error('Error calculating Euclidean distance:', error);
      throw error;
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
              <h2 style={{ fontSize: '30px', fontWeight: '600', color: '#431C76', padding: '4vh' }}>Candidate Details</h2>
              {capturedImage && (
                <div>
                  <h3>Captured Face</h3>
                  <img src={capturedImage} alt="Captured Face" style={{ width: '200px', height: 'auto' }} />
                </div>
              )}
              <Row xs={1} md={2} lg={3} className="g-4">
                {matchedCandidates.map((candidate, index) => (
                  <Col key={candidate.email}>
                    <Card className='cardm'>
                      <Card.Body className='m-0 p-0'>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '0' }}>
                          {candidate.symbolUrl && <IconImage src={candidate.symbolUrl} className='imgicon' alt={`Symbol of ${candidate.name}`} style={{ height: '5vh', width: '5vh' }} />}
                          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                            <Card.Title className="bold-text" style={{ margin: 'auto' }}>{candidate.name}</Card.Title>
                          </div>
                        </div>
                        <hr />
                        {candidate.imageUrl && <Card.Img src={candidate.imageUrl} alt={`Image of ${candidate.name}`} style={{ height: '200px' }} />}

                        <div style={{ marginTop: '1vh' }}>
                          <DescriptionText description={candidate.description} />
                          <Card.Text className="email-text">Email:{candidate.email}</Card.Text>
                        </div>
                        <Button onClick={() => handleVote(index)}>Vote</Button>
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

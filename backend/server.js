const express = require('express');
const Web3 = require('web3');
const cors = require('cors');
const axios = require('axios');
const { loadImage, createCanvas } = require('canvas');
const ElectionFact = require('../build/contracts/ElectionFact.json');
const Election = require('../build/contracts/Election.json');

const app = express();
const port = 3001;

const web3 = new Web3('http://localhost:7545'); // Connect to your local Ethereum node
const electionFactContract = new web3.eth.Contract(ElectionFact.abi, '0xe3581968805d92e6F5B345bCC732c77d15821E0e'); // Replace with ElectionFact contract address
const electionContract = new web3.eth.Contract(Election.abi, '0x43e114212b024e407e7e6150c16366624F67803a'); // Replace with Election contract address

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin: '*'
  }));
  
// Create Election endpoint
app.post('/election', async (req, res) => {
    const { email, election_name, election_description } = req.body;
    
    try {
        const accounts = await web3.eth.getAccounts();
        await electionFactContract.methods.createElection(email, election_name, election_description)
            .send({ from: accounts[0], gas: 3000000 });
        
        res.status(201).json({ message: 'Election created successfully' });
        console.log("election created successfullyy");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create election' });
    }
});

// Add Candidate endpoint
// Add Candidate endpoint
app.post('/candidate', async (req, res) => {
    const { candidate_name, candidate_description, imgHash, email } = req.body;
    
    try {
        const accounts = await web3.eth.getAccounts();
        await electionContract.methods.addCandidate(candidate_name, candidate_description, imgHash, email)
            .send({ from: accounts[0], gas: 3000000 });
        
        res.status(201).json({ message: 'Candidate added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add candidate' });
    }
});


// Vote endpoint
app.post('/vote', async (req, res) => {
    const { candidateID, email } = req.body;
    
    try {
        const accounts = await web3.eth.getAccounts();
        await electionContract.methods.vote(candidateID, email)
            .send({ from: accounts[0], gas: 3000000 });
        
        res.status(200).json({ message: 'Vote registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register vote' });
    }
});

// Fetch Election Details endpoint
app.get('/election/:email', async (req, res) => {
    const { email } = req.params;
    
    try {
        const electionDetails = await electionFactContract.methods.getDeployedElection(email).call();
        res.status(200).json({ electionDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch election details' });
    }
});

// Fetch Candidate Details endpoint
app.get('/candidate/:candidateID', async (req, res) => {
    const { candidateID } = req.params;
    
    try {
        const candidateDetails = await electionContract.methods.getCandidate(candidateID).call();
        res.status(200).json({ candidateDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch candidate details' });
    }
});

// Fetch Winner endpoint
// Fetch Winner endpoint
app.get('/winner', async (req, res) => {
    try {
        const winnerID = await electionContract.methods.winnerCandidate().call();
        const winnerDetails = await electionContract.methods.getCandidate(winnerID).call();
        const winnerName = winnerDetails[0]; // Assuming the candidate name is the first element in the returned array
        res.status(200).json({ winnerName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to determine winner' });
    }
});



app.get('/candidates', async (req, res) => {
    try {
        // Implement logic to fetch all candidate details
        // For example, you can query the Election contract to get all candidates
        const numCandidates = await electionContract.methods.getNumOfCandidates().call();
        const candidates = [];
        for (let i = 0; i < numCandidates; i++) {
            const candidateDetails = await electionContract.methods.getCandidate(i).call();
            candidates.push(candidateDetails);
        }
        res.status(200).json({ candidates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
});



// Fetch Election Results endpoint
app.get('/election/result/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const accounts = await web3.eth.getAccounts();
        const electionDetails = await electionFactContract.methods.getDeployedElection(email).call({ from: accounts[0] });

        // Check if the email matches the creator's email
        if (electionDetails.deployedAddress !== '0x0000000000000000000000000000000000000000') {
            // Retrieve the winner's candidate ID
            const winnerID = await electionContract.methods.winnerCandidate().call({ from: accounts[0] });

            // Fetch details of all candidates
            const numCandidates = await electionContract.methods.getNumOfCandidates().call({ from: accounts[0] });
            const candidates = [];
            const winner = []; // Array to store winner's data
            for (let i = 0; i < numCandidates; i++) {
                const candidateDetails = await electionContract.methods.getCandidate(i).call({ from: accounts[0] });
                candidates.push(candidateDetails);
                // Check if the candidate is the winner
                if (i == winnerID) {
                    winner.push(candidateDetails);
                }
            }

            res.status(200).json({ electionDetails, candidates, winner });
        } else {
            // Return error for unauthorized access
            res.status(403).json({ error: 'Unauthorized access' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch election result' });
    }
});



app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});
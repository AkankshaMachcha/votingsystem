// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ElectionFact {
    
    struct ElectionDet {
        address deployedAddress;
        string el_n;
        string el_d;
    }
    
    mapping(string => ElectionDet) companyEmail;
    
    // Function to create a new election
    function createElection(string memory email, string memory election_name, string memory election_description) public {
        address newElection = address(new Election(msg.sender, election_name, election_description));
        
        companyEmail[email].deployedAddress = newElection;
        companyEmail[email].el_n = election_name;
        companyEmail[email].el_d = election_description;
    }
    
    // Function to get deployed election details
    function getDeployedElection(string memory email) public view returns (address, string memory, string memory) {
        address val = companyEmail[email].deployedAddress;
        if(val == address(0)) 
            return (address(0), "", "Create an election.");
        else
            return (companyEmail[email].deployedAddress, companyEmail[email].el_n, companyEmail[email].el_d);
    }
}

contract Election {

    address public election_authority;
    string public election_name;
    string public election_description;
    bool public status;
    
    // Modifier to restrict access to election_authority
    modifier onlyOwner() {
        require(msg.sender == election_authority, "Error: Access Denied.");
        _;
    }

    // Struct to represent a candidate
    struct Candidate {
        string candidate_name;
        string candidate_description;
        string imgHash;
        uint8 voteCount;
        string email;
    }

    // Mapping to store candidates
    mapping(uint8 => Candidate) public candidates;

    // Struct to represent a voter
    struct Voter {
        uint8 candidate_id_voted;
        bool voted;
    }

    // Mapping to store voters
    mapping(string => Voter) public voters;

    // Counter for number of candidates
    uint8 public numCandidates;

    // Counter for number of voters
    uint8 public numVoters;

    // Constructor to initialize the election
    constructor(address authority, string memory name, string memory description) {
        election_authority = authority;
        election_name = name;
        election_description = description;
        status = true;
    }

    // Function to add a candidate
    function addCandidate(string memory candidate_name, string memory candidate_description, string memory imgHash, string memory email) public onlyOwner {
        uint8 candidateID = numCandidates++;
        candidates[candidateID] = Candidate(candidate_name, candidate_description, imgHash, 0, email);
    }

    // Function for voters to cast their vote
    function vote(uint8 candidateID, string memory e) public {
        require(!voters[e].voted, "Error: You cannot double vote");
        
        voters[e] = Voter(candidateID, true);
        numVoters++;
        candidates[candidateID].voteCount++;
    }

    // Function to get the number of candidates
    function getNumOfCandidates() public view returns(uint8) {
        return numCandidates;
    }

    // Function to get the number of voters
    function getNumOfVoters() public view returns(uint8) {
        return numVoters;
    }

    // Function to get candidate information
    function getCandidate(uint8 candidateID) public view returns (string memory, string memory, string memory, uint8, string memory) {
        return (candidates[candidateID].candidate_name, candidates[candidateID].candidate_description, candidates[candidateID].imgHash, candidates[candidateID].voteCount, candidates[candidateID].email);
    } 

    // Function to return winner candidate ID
    function winnerCandidate() public view onlyOwner returns (uint8) {
        uint8 largestVotes = candidates[0].voteCount;
        uint8 candidateID;
        for(uint8 i = 1; i < numCandidates; i++) {
            if(largestVotes < candidates[i].voteCount) {
                largestVotes = candidates[i].voteCount;
                candidateID = i;
            }
        }
        return candidateID;
    }
    
    // Function to get election details
    function getElectionDetails() public view returns(string memory, string memory) {
        return (election_name, election_description);    
    }
}

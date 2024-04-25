import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminLogin from './Admin/login/AdminLogin';
import UserRegister from './User/Register/UserRegister';
import UserLogin from './User/Login/UserLogin';
import MainPage from './Admin/Dashboard/MainPage';
import AddElectionContainer from './Admin/Dashboard/AddElectionContainer';
import AddCandidateContainer from './Admin/Dashboard/AddCandidateContainer ';
import ListCandidatesContainer from './Admin/Dashboard/ListCandidatesContainer ';
import DeployVotesContainer from './Admin/Dashboard/DeployVotesContainer ';
import Vote from './User/Dashboard/Vote';
import Login from './Login';
import SideNav from './Admin/Dashboard/SideNav';
import SideNavUser from './User/Dashboard/SideNavUser';
import Profile from './User/Dashboard/Profile';
import WatchResults from './User/Dashboard/WatchResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dash" element={<SideNav />} />
        <Route path="/user-dash/:userId" element={<SideNavUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/voter-register" element={<UserRegister />} />
        <Route path="/voter-login" element={<UserLogin />} />
        <Route path="/admin/dashboard" element={<MainPage />} />
        <Route path="/admin/dashboard/create-election" element={<AddElectionContainer />} />
        <Route path="/admin/dashboard/add-candidate" element={<AddCandidateContainer />} />
        <Route path="/admin/dashboard/list-candidates" element={<ListCandidatesContainer />} />
        <Route path="/admin/dashboard/deploy-votes" element={<DeployVotesContainer />} />
        <Route path="/vote/:userId" element={<Vote />} />
        <Route path="/results/:userId" element={<WatchResults />} />
        <Route path="/Profile/:userId" element={<Profile />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

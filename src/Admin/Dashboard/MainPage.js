import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div>
      <h1>Election Dashboard</h1>
      <div>
        <h2>Add Election</h2>
        <Link to="/admin/dashboard/create-election">Add Election</Link>
      </div>
      <div>
        <h2>Add Candidate</h2>
        <Link to="/admin/dashboard/add-candidate">Add Candidate</Link>
      </div>
      <div>
        <h2>Deploy Votes</h2>
        <Link to="/admin/dashboard/deploy-votes">Deploy Votes</Link>
      </div>
      <div>
        <h2>List Candidates</h2>
        <Link to="/admin/dashboard/list-candidates">List Candidates</Link>
      </div>
    </div>
  );
};

export default MainPage;

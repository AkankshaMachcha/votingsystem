import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import logo from './images/inbox_303652.png';
import mainPageVoteSVG from './images/mainpage vote.svg';
import './css/home.css';


const Home = () => {
  const navigate = useNavigate();

  const login =()=>{
    navigate('/login');
  }
 
  return (
    // <div className='flex d-flex justify-content-between text-center w-25'>
    //   <button className='btn btn-primary' onClick={loginAsAdmin}>Login as Admin</button>
    //   <button className='btn btn-primary' onClick={loginAsVoter}>Login as Voter</button>
    // </div>
    <div className='mainhomepage'>
      <div className='header'>
        <Navbar bg="transparent" variant="light" className='navbar'>
          <Container>
            {/* Add the logo here */}
            <Navbar.Brand className='logo'>
              <img
                src={logo} // Use the imported logo image
                alt="Project Logo"
                height="40"
                className="d-inline-block align-top"
              />
              {' '}
              <span className='logoname'> VoteChain</span>
            </Navbar.Brand>
            <Nav className="ms-auto links">
              <Nav.Link href="#" className='link'>How to Vote</Nav.Link>
              <Nav.Link href="#" className='link'>About Us</Nav.Link>
              <Nav.Link href="#" className='link login' onClick={login}>Login</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>

      {/* Main Content */}
      <Container fluid>
        <Container className="mt-5">
          <div className="row">
            <div className="col-md-4">
              <div className="main-body" style={{display: 'flex', alignItems: 'center'}}>
                <div className="card-body">
                  
                  <p className="card-text">
                    <span className='bodytext poppins-light'>Be a part of decision</span><br />
                    <span className='bodytext2'>Vote Today</span>
                    <br /><br />
                   <span className='bodydescription'> Welcome to VoteChain, where your voice matters. Cast your vote securely and transparently, ensuring a brighter future for all.</span>
                  </p>
                  <div>
                    <button className="btn btn1" onClick={login}>Register</button>
                    <button className="btn btn2">Learn More</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-8 align-items-center text-center">
              <img src={mainPageVoteSVG} alt="SVG Image" style={{height:'70%'}}/>

            </div>
          </div>
        </Container>
      </Container>
    </div>

  )
}

export default Home

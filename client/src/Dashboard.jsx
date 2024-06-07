import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPills, FaClipboardList, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.location.href = '/Home';
  };

  const toggleNavMenu = () => {
    setNavOpen(!navOpen);
  };

  const closeNavMenu = () => {
    setNavOpen(false);
  };

  return (
    <div>
      <div className="header">
          <button className="back-button" onClick={() => window.history.back()}>
            <FaArrowLeft />Back
          </button>
          <img src="Home.png"  className='logoimage' />
          <div className="navbar" onClick={toggleNavMenu} onMouseEnter={toggleNavMenu} onMouseLeave={closeNavMenu}>
            <button className="nav-button">
              {navOpen ? <FaTimes /> : <FaBars />}
            </button>
            {navOpen && (
              <div className="nav-menu">
                <Link to="/userprofile"><button className="nav-item">User Profile</button></Link>
                <Link to="/changepassword"><button className="nav-item">Change Password</button></Link>
                <button className="nav-item" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-image-container">
            <img src="pic8.png" alt="Dashboard Image" className='dashboard-image' />
          </div>
          <div className="dashboard-text-container">
            <h1 className="dashboard-titlee">Welcome to E-MEDOC</h1>
            <p className="dashboard-description">
              Explore alternative medicine options and improve your health.
            </p>
            <div className="button-container">
              <div className="button-group">
                <Link to="/alternativemedicine">
                  <button className="dashboard-button" style={{ marginRight: '10px', marginBottom: '10px'}}>
                    <FaSearch className="button-icon" />Search Alternative Medicine
                  </button>
                </Link>
                <Link to="/Searchmedicine">
                  <button className="dashboard-button">
                    <FaSearch className="button-icon" />Search Medicine
                  </button>
                </Link>
                <Link to="/Feedback">
                  <button className="dashboard-button">
                    <FaPills className="button-icon" />FeedBack
                  </button>
                </Link>
                <Link to="/ShowPrescription">
                  <button className="dashboard-button">
                    <FaClipboardList className="button-icon" />Show Prescription
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {FaCommentDots, FaPencilAlt, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes, FaSearch, FaPills, FaClipboardList, } from 'react-icons/fa';
import './dDashboardmain.css';

const DoctorDashboardmain = () => {
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('doctorEmail');
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
                  <Link to="/doctorprofile"><button className="nav-item">User Profile</button></Link>
                  <Link to="/DRchangepassword"><button className="nav-item">Change Password</button></Link>
                  <button className="nav-item" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
      </div>
        <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-image-container">
            <img src="pic12.png" alt="Dashboard Image" className='dashboard-image' />
          </div>
          <div className="dashboard-text-container">
          <h1 className="dashboard-titlee">Welcome to E-MEDOC</h1>
          <p className="dashboard-description">
            Explore alternative medicine options and improve your health.
          </p>
          <div className="button-container">
            <div className="button-group">
              <Link to="/Prescription-dashboard">
                <button className="dashboard-button">
                  <FaPills className="button-icon" /> Send Prescription
                </button>
              </Link>
              <Link to="/alternativemedicine">
                <button className="dashboard-button" style={{ marginRight: '10px', marginBottom: '10px'}}>
                  <FaSearch className="button-icon" />Search Alternative Medicine
                </button>
              </Link>
              <Link to="/Feedback">
                  <button className="dashboard-button">
                    <FaCommentDots className="button-icon" />FeedBack
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

export default DoctorDashboardmain;

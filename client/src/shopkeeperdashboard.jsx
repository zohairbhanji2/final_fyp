import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelopeOpenText, FaReply, FaComment, FaBell, FaSearch, FaPills, FaClipboardList, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
// here i can use FaEnvelopeOpenText, FaReply, FaComment, FaBell in response option
import './shopkeeperdashboard';

const ShopkeeperDashboard = () => {
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
                <Link to="/shopprofile"><button className="nav-item">User Profile</button></Link>
                <Link to="/SHchangepassword"><button className="nav-item">Change Password</button></Link>
                <button className="nav-item" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-image-container">
            <img src="pic2.png" alt="Dashboard Image" className='dashboard-image' />
          </div>
          <div className="dashboard-text-container">
            <h1 className="dashboard-titlee">Welcome to E-MEDOC</h1>
            <p className="dashboard-description">
              Explore Medical Stores options and improve your health.
            </p>
            <div className="button-container">
              <div className="button-group">
                <Link to="/viewresponses">
                  <button className="dashboard-button">
                    <FaEnvelopeOpenText className="button-icon" />View/Reply Responses
                  </button>
                </Link>
                <Link to="/alternativemedicine">
                  <button className="dashboard-button" style={{ marginRight: '10px', marginBottom: '10px'}}>
                    <FaSearch className="button-icon" />Search Alternative Medicine
                  </button>
                </Link>
                <Link to="/Feedback">
                  <button className="dashboard-button">
                    <FaComment className="button-icon" />FeedBack
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

export default ShopkeeperDashboard;

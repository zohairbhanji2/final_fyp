import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaPills, FaClipboardList, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import './userprofile.css';

const UserProfile = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail'); 
        const response = await axios.get(`http://192.168.0.105:5000/api/user/profile?email=${userEmail}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchUserProfile();
  }, []);

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

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div>
    <div className="header">
          <button className="back-button" onClick={() => window.history.back()}>
            <FaArrowLeft />Back
          </button>
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
      <div className="profile-container">
        {userData && (
          <div className="profile-box">
            <div className="profile-circle">
              <p className="profile-initial">{capitalizeFirstLetter(userData.username.charAt(0))}</p>
            </div>
            <div className="profile-details">
              <div className="detail"><strong>Name:</strong> <span>{userData.username}</span></div>
              <div className="detail"><strong>Email:</strong> <span>{userData.email}</span></div>
              <div className="detail"><strong>CNIC:</strong> <span>{userData.cnic}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default UserProfile;

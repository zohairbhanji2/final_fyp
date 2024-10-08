import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaPills, FaClipboardList, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import './doctorprofile.css';

const DoctorProfile = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const doctorEmail = localStorage.getItem('doctorEmail'); 
        const response = await axios.get(`https://final-fyp.onrender.com/api/doctor/profile?email=${doctorEmail}`);
        setDoctorData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchUserProfile();
  }, []);

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
                <Link to="/doctorprofile"><button className="nav-item">Doctor Profile</button></Link>
                <Link to="/DRchangepassword"><button className="nav-item">Change Password</button></Link>
                <button className="nav-item" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
      </div>
      <div className="profile-container">
        {doctorData && (
          <div className="profile-box">
            <div className="profile-circle">
              <p className="profile-initial">{capitalizeFirstLetter(doctorData.username.charAt(0))}</p>
            </div>
            <div className="profile-details">
              <div className="detail"><strong>Name:</strong> <span>{doctorData.username}</span></div>
              <div className="detail"><strong>Email:</strong> <span>{doctorData.email}</span></div>
              <div className="detail"><strong>License Number:</strong> <span>{doctorData.licensenumber}</span></div>
              {/* <div className="detail"><strong>CNIC:</strong> <span>{doctorData.cnic}</span></div> */}
              {/* <div className="detail"><strong>Phone Number:</strong> <span>{doctorData.Phonenumber}</span></div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default DoctorProfile;

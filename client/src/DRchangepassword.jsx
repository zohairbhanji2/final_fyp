import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaPills, FaClipboardList, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import './DRchangepassword.css';

const DRchangepassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const doctorEmail = localStorage.getItem('doctorEmail');
    if (doctorEmail) {
      setEmail(doctorEmail);
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const doctorEmail = localStorage.getItem('doctorEmail');
      const response = await axios.post(`http://192.168.0.105:5000/api/DRchangepassword?email=${doctorEmail}`, {
        email: doctorEmail,
        oldPassword,
        newPassword,
        confirmPassword,
      });
      setMessage(response.data.message);
      setEmail(),
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

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
      <div class="login-box">
        <h2>Change Password</h2>
        <br></br>
        <form onSubmit={handleChangePassword}>
          <div className='user-box'>
          <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
          <div className='user-box'>
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />        
          </div>
          <div className='user-box'>
          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          {message && <p>{message}</p>}
          <center>
            <a>
              <button type="submit">Submit</button>
            </a>
          </center>
        </form>
      </div>
    </div>
  );
};

export default DRchangepassword;
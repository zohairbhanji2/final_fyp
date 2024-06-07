import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPills, FaClipboardList, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './Feedback.css';

function Feedback() {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    MobileNo: '',
    Comment: ''
  });
  const [navOpen, setNavOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://192.168.0.105:5000/api/feedback', formData);
      alert('Feedback submitted successfully!');
      setFormData({
        Name: '',
        Email: '',
        MobileNo: '',
        Comment: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

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
      <div className="feedback-container">
        <h2 style={{ textAlign: "center", marginBottom: "10px", color: "black" }}>Feedback</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Name">Name:</label>
          <input id="Name" name="Name" value={formData.Name} onChange={handleChange} required />
    
          <label htmlFor="Email">Email:</label>
          <input type="email" id="Email" name="Email" value={formData.Email} onChange={handleChange} required />
    
          <label htmlFor="MobileNo">Mobile:</label>
          <input type="tel" id="MobileNo" name="MobileNo" value={formData.MobileNo} onChange={handleChange} required />
    
          <label htmlFor="Comment">Comment:</label>
          <textarea id="Comment" name="Comment" value={formData.Comment} onChange={handleChange} required />
          
    
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  );  
}

export default Feedback;

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaPills, FaClipboardList, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import PrescriptionViewer from './prescriptionviewer';
import "./prescriptiondashboard.css";

const DoctorDashboard = () => {
  const [prescription, setPrescription] = useState({
    medicine: '',
    dosage: '',
    Date: '',
    email: '',
  });
  
  const [errors, setErrors] = useState({});
  const [navOpen, setNavOpen] = useState(false);

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
  
    if (!prescription.medicine || !prescription.dosage || !prescription.Date || !prescription.email) {
      setErrors({ allFields: 'All fields are required for a prescription.' });
      return;
    }
  
    const formData = new FormData();
    formData.append('medicine', prescription.medicine);
    formData.append('dosage', prescription.dosage);
    formData.append('Date', prescription.Date);
    formData.append('email', prescription.email);
  
    try {
      const response = await axios.post('http://192.168.1.15:5000/api/sendPrescription', prescription);

      console.log('Response data:', response.data);
    } catch (error) {
      console.error('Error sending prescription:', error);
      alert('An error occurred. Please check the console for details.');
    }
  
    setPrescription({
      medicine: '',
      dosage: '',
      Date: '',
      email: '',
    });
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
                    <Link to="/doctorprofile"><button className="nav-item">User Profile</button></Link>
                    <Link to="/DRchangepassword"><button className="nav-item">Change Password</button></Link>
                    <button className="nav-item" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
      </div>
      <div className="Prescription-dashboard">
        <img src="./logo emedoc.png" alt="Logo" className="login-logo" />
        <br></br>
        <h2>Doctor Dashboard</h2>
        <form onSubmit={handlePrescriptionSubmit} className="prescription-form">
          <div className="form-group">
            <label htmlFor="medicine">Medicine</label>

            <input
              type="text"
              id="medicine"
              placeholder="Enter medicine name"
              value={prescription.medicine}
              onChange={(e) => setPrescription({ ...prescription, medicine: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dosage">Dosage</label>
            <input
              type="text"
              id="dosage"
              placeholder="Enter dosage"
              value={prescription.dosage}
              onChange={(e) => setPrescription({ ...prescription, dosage: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Date">Dates</label>
            <input
              type="text"
              id="Date"
              placeholder="Enter Dates"
              value={prescription.Date}
              onChange={(e) => setPrescription({ ...prescription, Date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Patient email</label>
            <input
              type="text"
              id="email"
              placeholder="Enter patient email"
              value={prescription.email}
              onChange={(e) => setPrescription({ ...prescription, email: e.target.value })}
              required
            />
          </div>
        
          {errors.allFields && <p className="error-message">{errors.allFields}</p>}
          <button type="submit" className="submit-button">Send Prescription</button>
        </form>  
    
      </div>
    </div>
  );
};

export default DoctorDashboard;
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function RegisterAsDoctor() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    licensenumber: '',
    gender: '',
    type: 'doctor',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = 'Full Name is required and must be at least 2 characters.';
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email address is required.';
    }

    const passwordRegex = /^.{8,}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.cnic || formData.cnic.length !== 13) {
      newErrors.cnic = 'CNIC is required and must be exactly 13 digits.';
    }

    if (!formData.licensenumber) {
      newErrors.licensenumber = 'Doctor License is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('https://final-fyp.onrender.com/api/register', {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          cnic: formData.cnic,
          licensenumber: formData.licensenumber,
          type: formData.type,
        });

        if (response.status === 200) {
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('userType', formData.type);
          setMessage('Registered successfully!');
        } else {
          setMessage('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        setMessage('Registration failed. Please try again.');
      }
    } else {
      setMessage('Please fix the errors in the form.');
    }
  };

  return (
    <div className="container">
      <div className="title">Doctor Registration</div>
      <div className="content">
        <form>
          <div className="user-details">
            <div className="input-box">
              <span className="details">Full Name</span>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              {errors.fullName && <p className="error-message">{errors.fullName}</p>}
            </div>
            <div className="input-box">
              <span className="details">Username</span>
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              {errors.username && <p className="error-message">{errors.username}</p>}
            </div>
            <div className="input-box">
              <span className="details">Email</span>
              <input
                type="text"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="input-box">
              <span className="details">Phone Number</span>
              <input
                type="text"
                placeholder="Enter your number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
              {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
            </div>
            <div className="input-box">
              <span className="details">Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <div className="input-box">
              <span className="details">Confirm Password</span>
              <input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>
            <div className="input-box">
              <span className="details">CNIC (13 digits)</span>
              <input
                type="text"
                placeholder="Enter your CNIC"
                value={formData.cnic}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                required
              />
              {errors.cnic && <p className="error-message">{errors.cnic}</p>}
            </div>
            <div className="input-box">
              <span className="details">Doctor License</span>
              <input
                type="text"
                placeholder="Enter your Doctor License"
                value={formData.licensenumber}
                onChange={(e) => setFormData({ ...formData, licensenumber: e.target.value })}
                required
              />
              {errors.licensenumber && <p className="error-message">{errors.licensenumber}</p>}
            </div>
          </div>

          <div className="button">
            <button className="register-button" onClick={handleRegister}>
              Register
            </button>
          </div>
        </form>
        <p className="message">{message}</p>
      </div>
    </div>
  );
}

export default RegisterAsDoctor;

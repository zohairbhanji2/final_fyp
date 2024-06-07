import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function ShopkeeperRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    shopLocation: '',
    type: 'shopkeeper',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required.';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required.';
    } else if (!/^\d{11,12}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        'Invalid phone number format. It should be 11 or 12 digits and contain only numbers.';
    }

    const passwordRegex = /^.{8,}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.shopName) {
      newErrors.shopName = 'Shop Name is required.';
    }

    if (!formData.shopLocation) {
      newErrors.shopLocation = 'Shop Location is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleShopkeeperRegister = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('https://final-fyp.onrender.com/api/register', {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          shopName: formData.shopName,
          shopLocation: formData.shopLocation,
          type: formData.type,
        });

        if (response.status === 200) {
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('userType', formData.type);
          setMessage('Shopkeeper registered successfully!');
          window.location.href = '/ShopkeeperDashboard'; // Redirect to shop profile
        } else {
          setMessage('Shopkeeper registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during shopkeeper registration:', error);
        setMessage('Shopkeeper registration failed. Please try again.');
      }
    } else {
      setMessage('Please fix the errors in the form.');
    }
  };

  return (
    <div className="container">
      <div className="title">Shopkeeper Registration</div>
      <div className="content">
        <form>
          <div className="user-details">
            {/* Existing fields */}
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
              <span className="details">Shop Name</span>
              <input
                type="text"
                placeholder="Enter your shop name"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                required
              />
              {errors.shopName && <p className="error-message">{errors.shopName}</p>}
            </div>
            <div className="input-box">
              <span className="details">Shop Location</span>
              <input
                type="text"
                placeholder="Enter your shop location"
                value={formData.shopLocation}
                onChange={(e) => setFormData({ ...formData, shopLocation: e.target.value })}
                required
              />
              {errors.shopLocation && <p className="error-message">{errors.shopLocation}</p>}
            </div>
            {/* New fields */}
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
            {/* ... */}
          </div>

          <div className="button">
            <button className="register-button" onClick={handleShopkeeperRegister}>
              Register
            </button>
          </div>
        </form>

        <p className="message">{message}</p>
      </div>
    </div>
  );
}

export default ShopkeeperRegister;

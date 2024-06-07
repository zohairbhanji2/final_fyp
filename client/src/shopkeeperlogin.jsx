import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function ShopkeeperLogin() {
  const [formData, setFormData] = useState({
    username: '',
    email,
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required.';
    }
    if (!formData.email) {
      newErrors.password = 'Password is required.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleShopkeeperLogin = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('http://192.168.1.15:5000/api/login', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          type: 'shopkeeper',
        });

        if (response.status === 200) {
          localStorage.setItem('userEmail', formData.email); // Store email in local storage
          setMessage('Shopkeeper logged in successfully!');
          window.location.href = './ShopkeeperDashboard'; // Redirect to shop profile
        } else {
          setMessage('Shopkeeper login failed. Please check your credentials and try again.');
        }
      } catch (error) {
        console.error('Error during shopkeeper login:', error);
        setMessage('Shopkeeper login failed. Please check your credentials and try again.');
      }
    } else {
      setMessage('Please fix the errors in the form.');
    }
  };

  return (
    <div className="container">
      <div className="title">Shopkeeper Login</div>
      <div className="content">
        <form>
          <div className="user-details">
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
          </div>

          <div className="button">
            <button className="login-button" onClick={handleShopkeeperLogin}>
              Login as Shopkeeper
            </button>
          </div>
        </form>

        <p className="message">{message}</p>
      </div>
    </div>
  );
}

export default ShopkeeperLogin;

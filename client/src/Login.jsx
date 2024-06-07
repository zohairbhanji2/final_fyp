import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './Home.css'; 
import Dashboard from './Dashboard';
import AlternativeMedicine from './Alternativemedicine';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState(''); 
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://192.168.1.15:5000/api/login', {
        email: email,
        password: password,
        licenseNumber: licenseNumber, 
      });

      if (response.status === 200) {
        window.location.href = '/dashboard';
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

}

export default Login;

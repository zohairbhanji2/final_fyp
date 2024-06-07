import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './Home.css'; 


function LoginAsDoctor() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://final-fyp.onrender.com/api/Loginasdoctor', {
        email: email,
        password: password,
      
       
      });

      if (response.status === 200) {
        
        window.location.href = '/Prescription-dashboard';
      } else {
        
        setLoginError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during doctor login:', error);
      
      setLoginError('Login failed. Please try again.');
    }
  }

  return (
    <Container maxWidth="sm" className="login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="login-form">
      <img src="./logo emedoc.png" alt="Logo" className="login-logo" />
        <Typography variant="h4" className="login-heading">
          Doctor Login
        </Typography>

        <div className="fields">
          <label class="form-label" for="email">Email</label>
          <input type="email" class="form-control form-control-lg" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label class="form-label" for="password">Password</label>
          <input type="password" class="form-control form-control-lg" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
     
        </div>
        <br></br>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} className="login-button">
          Login
        </Button>
        <Link to="/Home" className="styled-link">Login as User</Link>
        <Link to="/register" className="styled-link">Register as User</Link>
        <Link to="/Registerasdoctor" className="styled-link">Register as Doctor</Link>
        <Link to="/forgot-password" className="styled-link">Forgot Password</Link>
        {loginError && <p className="error-message">{loginError}</p>}
      </div>
    </Container>
  );


}

export default LoginAsDoctor;
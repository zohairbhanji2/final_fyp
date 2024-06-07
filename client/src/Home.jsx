import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './Home.css';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://final-fyp.onrender.com/api/login', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        if (response.data.type === 'user') {
          localStorage.setItem('userEmail', email);
          window.location.href = '/Dashboard';
        } else if (response.data.type === 'doctor') {
          localStorage.setItem('doctorEmail', email);
          window.location.href = '/doctordashboardmain';
        } else if (response.data.type === 'shopkeeper') {
          localStorage.setItem('shopkeeperEmail', email);
          window.location.href = '/shopkeeperdashboard'; 
        }
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && email && password) {
      handleSubmit();
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);

    let passwordInput = document.getElementById("password");
    passwordInput.type = showPassword ? "password" : "text";
  };

  return (
    <Container maxWidth="sm" className="login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="login-form">
      <img src="./Home.png" alt="Logo" className="login-logo big-logo" />
        <br></br>
        <Typography variant="h4" className="login-heading">
          Login Your Account
        </Typography>
        <br></br>

        <div className="fields">
          <label className="form-label" htmlFor="email">Email</label>
          <input type="email" className="form-control form-control-lg transparent-background" id="email" name="email" placeholder='abc12@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={handleKeyPress} required autoComplete='off'/>
          <br></br>
          
          <div className="password-field" style={{ width: '300px', height: '60px'}}>
            <label className="form-label" htmlFor="password">Password</label>
            <input type="password" className="form-control form-control-lg transparent-background" id="password" name="password" placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="visibility-icons">
              <Visibility onClick={handleShowPassword} style={{ display: showPassword ? 'none' : 'block' }} />
              <VisibilityOff onClick={handleShowPassword} style={{ display: showPassword ? 'block' : 'none' }} />
            </div>
          </div>
        </div>

        <br />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} className="login-button">
          Login
        </Button>
        <br />
        <Link to="/register" className="styled-link">Register as User</Link>
        <Link to="/shopkeeperregister" className="styled-link">Register as shopkeeper</Link>
        <Link to="/Registerasdoctor" className="styled-link">Register as Doctor</Link>
        <Link to="/sendpasswordlink" className="styled-link">Forgot Password</Link>
        {loginError && <p className="error-message">{loginError}</p>}
      </div>
    </Container>
  );
}

export default Home;

import React, { useState, useEffect } from 'react';
import './Home.css';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const ForgotPassword = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userValid = async () => {
    try {
      //http://192.168.1.15:3000/api/forgotpassword/${id}/${token}
      const res = await axios.get(`http://192.168.1.15:5000/api/forgotpassword/${id}/`, {
        headers: {
          'x-auth-token': localStorage.getItem('resetToken'), // Use your own storage key
        },
      });
      const data = res.data;

      if (data.status === 201) {
        console.log("User is valid");
      } else {
        history("*");
      }
    } catch (error) {
      console.error('Error validating user:', error);
      
    }
  };

  const sendpassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`/api/resetpassword/${id}`, { password }, {
        headers: {
          'x-auth-token': localStorage.getItem('resetToken'),
        },
      });
      const data = await res.data;
      
      if (data.status === 201) {
        setPassword('');
        setConfirmPassword('');
        setMessage("Password updated successfully!...");
      } else {
        history("*");
      }
    } catch (error) {
      console.error('Error sending password:', error);
      setError("Error while updating new Password");
      
    }
  };

  useEffect(() => {
    userValid();
  }, []);


  const setVal = (e) => {
    setError(""); 
    if (e.target.name === "password") {
      setPassword(e.target.value);
    } else if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    }
  };

  return (
    <>
      <section>
        <Container maxWidth="sm" className="login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div className="login-form">
            <div className="form_heading">
              <h1>Enter Your New Password</h1>
            </div>
            <form>
              <br></br>
              <div className="fields">
                <label className="form-label" htmlFor="Password">New Password</label>
                <input type="password" className="form-control form-control-lg" value={password} onChange={setVal} name="password" id="password" placeholder='Enter Your New Password' />
              </div>
              <div className="fields">
                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input type="password" className="form-control form-control-lg" value={confirmPassword} onChange={setVal} name="confirmPassword" id="confirmPassword" placeholder='Confirm your New Password' />
              </div>
              <br></br>
              <div className="button">
                <button style={{width: "25vw"}} className="btn btn-primary" onClick={sendpassword}>Send Password</button>
              </div>
            </form>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
        </div>
        </Container>
      </section>
    </>
  );
};

export default ForgotPassword;
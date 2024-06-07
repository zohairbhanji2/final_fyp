import React, { useState } from 'react'
import './Home.css';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordReset = () => {
    const history = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const setVal = (e)=>{
        setEmail(e.target.value)
    }

    const sendLink = async (e) => {
        e.preventDefault();

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            const res = await axios.post(`http://192.168.1.15:5000/api/sendpasswordlink` , {email});
            setMessage('Password reset link sent successfully to your email.');
                        
            if (res.ok) {
                setEmail("");
                setError("");
                setMessage('Password reset link sent successfully to your email.');
            }
            else{
                throw new Error("Failed Invalid User..!");
            }
        }
        // }
        catch(error){
            console.error('Error sending password link:', error);
            setError(error.message || "Failed to send the password reset link.");
        }    
    };  
    
    return (
    <>
        <section>
            <Container maxWidth="sm" className="login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <div className="login-form">
                        <div className="form_heading">
                            <h1>Enter Your Email</h1>
                        </div>

                        {message && (<p style={{ color: 'green', fontWeight: 'bold' }}>password reset link send succesfully in your Email</p>)}
                        
                        <form>
                            <br></br>
                            <div className="fields">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input type="email" className="form-control form-control-lg" value={email} onChange={setVal} name="email" id="email" placeholder='Enter Your Email Address' />
                            </div>
                            <br></br>
                            <div className="button">
                                <button style={{width: "25vw"}} className="btn btn-primary" onClick={sendLink}>Send</button>
                            </div>
                        </form>
                    </div>
            </Container>
        </section>    
    </>
  )
};

export default PasswordReset
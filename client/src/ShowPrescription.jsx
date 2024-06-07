import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import PrescriptionViewer from './prescriptionviewer';
import './showprescription.css';

const ShowPrescription = () =>{
    const [showPrescriptions, setShowPrescriptions] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [navOpen, setNavOpen] = useState(false);

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

    const handleShowPrescription = () => {
        const userEmailFromStorage = localStorage.getItem('userEmail');

        if (userEmailFromStorage) {
            setUserEmail(userEmailFromStorage);
            setShowPrescriptions(true);
        } else {
            console.error('Prescription is not available!..');
        }
    };

    useEffect(() => {
        handleShowPrescription();
    }, []);

    return (
        <div className='top-mainone'>
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
            <div className='mainbody'>
              <div className='content1'>
                <img src="pic1.png" alt="Dashboard Image" className='dashboard-image' />
              </div>
              <div className='content2'>
                {showPrescriptions && userEmail && (
                <PrescriptionViewer userEmail={userEmail} />
                )}
              </div>  
            </div>

        </div>
    );
};

export default ShowPrescription;

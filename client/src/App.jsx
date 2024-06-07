import React, { useRef, useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Error from './Error';
import PasswordReset from './PasswordReset';
import ForgotPassword from './ForgotPassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import Registerasdoctor from './Registerasdoctor';
import Feedback from './Feedback'
import Dashboard  from './Dashboard';
import Alternativemedicine from './Alternativemedicine';
import Searchmedicine from './Searchmedicine';
import Loginasdoctor from './Loginasdoctor';
import PrescriptionDashboard from './Prescription-dashboard';
import PrescriptionViewer from './prescriptionviewer';
import SplashScreen from './SplashScreen';
import ChangePassword from './changepassword';
import DRChangePassword from './DRchangepassword';
import SHChangePassword from './SHchangepassword';
import DoctorDashboardmain from './doctordashboardmain';
import ShopkeeperRegister from './shopkeeperregister';
import ShopkeeperDashboard from "./shopkeeperdashboard";
import ViewResponses from './viewresponses';
import ShowPrescription from './ShowPrescription';
import UserProfile from './userprofile';
import DoctorProfile from './doctorprofile';
import ShopProfile from './shopprofile';

function App() {
  const [message, setMessage] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    fetch("http://192.168.0.105:5000/api/register")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to fetch data from the server.");
        }
      })
      .then((data) => {
        setMessage(data.message);
        setDataFetched(true); 
      })
      .catch((error) => setMessage(`Error: ${error.message}`));
  }, []);

  if (!dataFetched) {
    return <SplashScreen />;
  }
  return (
    <div >
      <h1>{message}</h1>
    <Router>
      <Routes>
      <Route path="/Home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/Registerasdoctor" element={<Registerasdoctor/>} />
        <Route path="/shopkeeperdashboard" element={<ShopkeeperDashboard />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<Home/> }/> */}
        <Route path="/" element={<Home />} exact />
        <Route path="/ShowPrescription" element={<ShowPrescription/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/doctordashboardmain" element={<DoctorDashboardmain/>} />
        <Route path="/shopkeeperregister" element={<ShopkeeperRegister/>} />
        {/* <Route path="/shopkeeperdashboard" element={<ShopkeeperDashboard/>} /> */}
        <Route path="/SplashScreen" element={<SplashScreen/>} />
        <Route path="/Feedback" element={<Feedback/>} />
        <Route path="/AlternativeMedicine" element={<Alternativemedicine/>} />
        <Route path="/Searchmedicine" element={<Searchmedicine/>} />
        <Route path="/loginasdoctor" element={<Loginasdoctor/>} />
        <Route path="/sendpasswordlink" element={<PasswordReset />} />
        <Route path="/resetpassword/:id" element={<ForgotPassword />} />
        <Route path="/changepassword" element={<ChangePassword/>} />
        <Route path="/DRchangepassword" element={<DRChangePassword/>} />
        <Route path="/SHchangepassword" element={<SHChangePassword/>} />
        <Route path="/viewresponses" element={<ViewResponses/>} />
        <Route path="/userprofile" element={<UserProfile/>} />
        <Route path="/doctorprofile" element={<DoctorProfile/>} />
        <Route path="/shopprofile" element={<ShopProfile/>} />
        <Route path="/prescriptionviewer" element={<PrescriptionViewer />} />
        <Route path="*" element={<Error />} />
        { <Route path="/Prescription-dashboard" element={<PrescriptionDashboard/>} />
        
                
}
      </Routes>
      </Router>
      </div>
  );
  
}

export default App;

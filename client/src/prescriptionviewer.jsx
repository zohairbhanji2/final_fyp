import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePrescription } from '@fortawesome/free-solid-svg-icons'; // Corrected import statement
import axios from 'axios';
import './prescriptionviewer.css';

const PrescriptionViewer = ({ userEmail }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`http://192.168.0.105:5000/api/getPrescriptions/${userEmail}`);
        console.log('Prescription data:', response.data);
        // Sort prescriptions in descending order based on date
        const sortedPrescriptions = response.data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        setPrescriptions(sortedPrescriptions);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, [userEmail]);

  return (
    <div className="prescription-grid">
        {prescriptions.length === 0 ? (
          <p>No prescriptions available.</p>
        ) : (
          prescriptions.map((prescription, index) => (
            <div key={index} className="prescription-box">
              <div className="rx-icon">
                <FontAwesomeIcon icon={faFilePrescription} />
              </div>
              <div className='datetag'>
                <p className='tdate'>Date: {prescription.Date}</p>
              </div>
              <br></br>
              <div className="prescription-details">
                <p className="medicine-name">Medicine Name: {prescription.medicine}</p>
                <p className="dosage">Dosage: {prescription.dosage}</p>
              </div>
            </div>
          ))
        )}
    </div>
  );
};

export default PrescriptionViewer;

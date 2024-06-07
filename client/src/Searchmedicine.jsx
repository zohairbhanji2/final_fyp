import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { Marker } from 'mapbox-gl';
import PrescriptionViewer from './prescriptionviewer';
import { Link } from 'react-router-dom';
import { FaSearch, FaPills, FaClipboardList, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes, FaBell } from 'react-icons/fa';
import './Searchmedicine.css';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZHItcml0aWNrLTI0IiwiYSI6ImNsdHhleG4wNjA1MXAybXBqZWtqOWY0YngifQ.MwvvD3gLs-zkt9WbZL9GNQ";

const defaultCoords = [67.0011, 24.8607];

const Searchmedicine = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [medicalStores, setMedicalStores] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [shopkeepers, setShopkeepers] = useState([]);
  const [selectedShopkeeper, setSelectedShopkeeper] = useState('');
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: defaultCoords,
        zoom: 12,
      });

      mapInstance.on('load', () => {
        setMap(mapInstance);
      });

      mapInstance.addControl(new mapboxgl.NavigationControl());
    };

    initializeMap();

    return () => map && map.remove();
  }, []);

  useEffect(() => {
    if (map && userLocation) {
      map.flyTo({
        center: userLocation,
        zoom: 14,
      });

      new mapboxgl.Marker().setLngLat(userLocation).addTo(map);

      setLocationInput(userLocation.join(','));

      fetchMedicalStores(userLocation);
    }
  }, [map, userLocation]);



  const fetchMedicalStores = async (location) => {
    try {
      const [lng, lat] = location;

      const radiusInMeters = 10000;

      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/medical.json?proximity=${lng},${lat}&limit=10&radius=${radiusInMeters}&access_token=${MAPBOX_ACCESS_TOKEN}`);
      const data = response.data;

      const stores = data.features.map(feature => ({
        name: feature.text,
        coordinates: feature.center
      }));

      setMedicalStores(stores);

      stores.forEach((store, index) => {
        new mapboxgl.Marker()
         .setLngLat(store.coordinates)
         .setPopup(new mapboxgl.Popup().setHTML(<p>${store.name}</p>))
         .addTo(map);
      });
    } catch (error) {
      console.error('Error fetching medical stores:', error);
    }
  };

  const handleLocationInput= (event) => {
    setLocationInput(event.target.value);

    const location = event.target.value;

   const [lng, lat] = location.split(',').map(parseFloat);
    if (!isNaN(lng) && !isNaN(lat)) {
      setUserLocation([lng, lat]);
    }
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  };
  useEffect(() => {
    const userEmailFromStorage = localStorage.getItem('userEmail');
    if (userEmailFromStorage) {
      setUserEmail(userEmailFromStorage);
    }
  }, []);

  useEffect(() => {
    const storedUserEmail = localStorage.getItem('userEmail');
    console.log('Retrieved userEmail from local storage:', storedUserEmail);
  
    if (!storedUserEmail) {
      console.log('No userEmail found in local storage. Cannot establish WebSocket connection.');
      return;
    }
  
    const websocket = new WebSocket(`ws://192.168.1.15:5001/user?user=${storedUserEmail}`);
  
    websocket.onopen = () => {
      console.log('User WebSocket connected');
      setWs(websocket);
    };
  
    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Message received:', message);
        if (message.error) {
          setError(message.error);
        } else if (message && message.email && message.response) {
          setResponses((prevResponses) => [...prevResponses, message]);
        } else {
          console.error('Invalid message format:', message);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    websocket.onclose = (event) => {
      console.log('User WebSocket disconnected:', event.reason);
    };
  
    return () => {
      websocket.close();
    };
  }, []); 
  
  const fetchShopkeepers = async () => {
    try {
      const response = await fetch('http://192.168.1.15:5000/api/shopkeepers');
      if (!response.ok) {
        throw new Error('Failed to fetch shopkeepers');
      }
      const data = await response.json();
      setShopkeepers(data.shopkeepers);
    } catch (error) {
      console.error('Error fetching shopkeepers:', error);
      setError('Failed to fetch shopkeepers. Please try again later.');
    }
  };

  useEffect(() => {
    fetchShopkeepers();
  }, []);

  const handleShowPrescription = () => {
    setShowPrescriptions(true);
  };

  const handleNotification = () => {
    if (selectedShopkeeper && question) {
      const payload = {
        shopName: selectedShopkeeper,
        question,
        from: userEmail,
      };
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
        console.log('Question sent:', payload);
      } else {
        console.error('WebSocket is not connected');
      }
    } else {
      console.error('Selected shopkeeper or question is missing');
      setError('Selected shopkeeper or question is missing');
    }
  };


  return (
    <div>
      <input
        type="text"
        placeholder="Enter location (longitude,latitude)"
        value={locationInput}
        onChange={handleLocationInput}
      />
      <button onClick={handleGetCurrentLocation}>Use Current Location</button>
      <div id="map" style={{ width: '100%', height: '400px' }}>
        {medicalStores.map((store, index) => (
        <div key={index} className="marker" style={{ position: 'absolute', transform: 'translate(-50%, -50%)', cursor: 'pointer' }}>    
        <div style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '50%' }}>{store.name}</div>        
        </div>
        ))}

      </div>
      <div>*
        <h2>Medical Stores within 10km</h2>
        <ul>
          {medicalStores.map((store, index) => (
            <li key={index}>{store.name}</li>
          ))}
        </ul>
      </div>

      <div className="button-group">
          <select value={selectedShopkeeper} onChange={(e) => setSelectedShopkeeper(e.target.value)}>
            <option value="">Select Shopkeeper</option>
            {shopkeepers.map((shopkeeper, index) => (
              <option key={index} value={shopkeeper.shopname}>{shopkeeper.shopname}</option>
            ))}
          </select>
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter your question" />
          <button onClick={handleNotification}><FaBell /> Send Notification</button>
      </div>
      {error && <p className="error-message">{error}</p>}
        <h2>Responses</h2>
        <ul>
          {responses.map((response, index) => (
            <li key={index}>{response.response}</li>
          ))}
        </ul>

    </div>
  );
};

export default Searchmedicine;
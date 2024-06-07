import React, { useState, useEffect } from 'react';
import './viewresponses.css';


const ViewResponses = () => {
  const [notifications, setNotifications] = useState([]);
  const [response, setResponse] = useState('');
  const [ws, setWs] = useState(null);
  const [shopName, setShopName] = useState('');

  useEffect(() => {
    const storedShopName = localStorage.getItem('shopName');
    if (storedShopName) {
      setShopName(storedShopName);
    }
  }, []);

  useEffect(() => {
    const storedShopName = localStorage.getItem('shopName');
    if (!storedShopName) {
      return;
    }

    const websocket = new WebSocket(`ws://192.168.0.105:5001/shopkeeper?user=${storedShopName}`);
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.error) {
          console.error(message.error);
        } else {
          setNotifications((prevNotifications) => [...prevNotifications, message]);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.reason);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const sendResponse = (email, response) => {
    if (!email || !response) {
      console.error('Email or response is missing');
      return;
    }

    try {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const message = { email, response };
        ws.send(JSON.stringify(message));
        console.log('Sent response:', message);
        setResponse('');
      } else {
        throw new Error('WebSocket is not connected');
      }
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  return (
    <div>
      <h1>Shopkeeper Dashboard</h1>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            {notification.question}
            <input
              type="text"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response"
            />
            <button onClick={() => sendResponse(notification.from, response)}>Send Response</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewResponses;

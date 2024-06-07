import React from 'react';

const SplashScreen = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src="/Home.png" 
        alt="Splash Screen Image"
        style={{ maxWidth: '100%', maxHeight: '100%', margin: 'auto' }}
      />
      <h1>Loading...</h1>
    </div>
  );
};

export default SplashScreen;

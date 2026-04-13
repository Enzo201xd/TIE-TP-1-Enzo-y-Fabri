import React from 'react';

const LoadingScreen = ({ visible }) => {
  return (
    <div className={`loading-screen ${visible ? '' : 'hidden'}`} id="loading-screen">
      <div className="equalizer">
        <div className="equalizer-bar" />
        <div className="equalizer-bar" />
        <div className="equalizer-bar" />
        <div className="equalizer-bar" />
        <div className="equalizer-bar" />
      </div>
      <div className="loading-text">Tuning into global frequencies...</div>
    </div>
  );
};

export default LoadingScreen;

import React from 'react';
import MapComponent from './MapComponent';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Global Trending Music</h1>
        <p>Discover what's trending right now around the world</p>
      </header>
      <main className="map-wrapper">
        <MapComponent />
      </main>
    </div>
  );
}

export default App;

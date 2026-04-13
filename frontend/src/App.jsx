import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedSong, setSelectedSong] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/trending');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // Filter out any error entries from the backend
      setTrendingData(data.filter(item => !item.error));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to connect to the backend. Make sure the Python server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data by selected region
  const filteredData = selectedRegion === 'ALL'
    ? trendingData
    : trendingData.filter(item => item.id === selectedRegion);

  // Extract unique regions for the filter pills
  const regions = trendingData.map(item => ({ id: item.id, name: item.region }));

  // Toggle song selection — clicking the same song unselects it
  const handleSelectSong = useCallback((songId) => {
    setSelectedSong(prev => prev === songId ? null : songId);
  }, []);

  return (
    <div className="app-shell">
      <Header
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        regions={regions}
      />

      {error && (
        <div className="error-overlay" id="error-overlay">
          <div className="error-icon">📡</div>
          <div className="error-title">Signal Lost</div>
          <div className="error-message">{error}</div>
          <button className="error-retry" onClick={fetchData} id="btn-retry">
            Retry Connection
          </button>
        </div>
      )}

      <div className="app-body">
        <Sidebar
          songs={filteredData}
          selectedSong={selectedSong}
          onSelectSong={handleSelectSong}
          isOpen={sidebarOpen}
          selectedRegion={selectedRegion}
        />
        <MapView
          songs={filteredData}
          selectedSong={selectedSong}
          onSelectSong={handleSelectSong}
        />
      </div>

      <LoadingScreen visible={loading} />
    </div>
  );
}

export default App;

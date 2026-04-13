import React from 'react';

const REGION_LABELS = {
  'AR': '🇦🇷 Argentina',
  'US': '🇺🇸 USA',
  'ZZ': '🌍 Global',
  'BR': '🇧🇷 Brasil',
  'MX': '🇲🇽 México',
  'GB': '🇬🇧 UK',
  'JP': '🇯🇵 Japan',
  'KR': '🇰🇷 Korea',
  'DE': '🇩🇪 Germany',
  'FR': '🇫🇷 France',
};

const Header = ({ selectedRegion, onRegionChange, sidebarOpen, onToggleSidebar, regions }) => {
  return (
    <header className="header" id="app-header">
      <div className="header-left">
        <button
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          id="sidebar-toggle-btn"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <div className="header-brand">
          <h1>Frequency</h1>
          <p>Global trending music, visualized</p>
        </div>
      </div>

      <nav className="region-filters" id="region-filters" aria-label="Filter by region">
        <button
          className={`region-pill ${selectedRegion === 'ALL' ? 'active' : ''}`}
          onClick={() => onRegionChange('ALL')}
          id="filter-all"
        >
          All Regions
        </button>
        {regions.map(region => (
          <button
            key={region.id}
            className={`region-pill ${selectedRegion === region.id ? 'active' : ''}`}
            onClick={() => onRegionChange(region.id)}
            id={`filter-${region.id.toLowerCase()}`}
          >
            {REGION_LABELS[region.id] || region.name}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;

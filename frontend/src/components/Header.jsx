import React from 'react';

const REGION_LABELS = {
  'AR': '🇦🇷 Argentina',
  'US': '🇺🇸 USA',
  'ZZ': '🌍 Global',
  'BR': '🇧🇷 Brasil',
  'CA': '🇨🇦 Canada',
  'AU': '🇦🇺 Australia',
  'ES': '🇪🇸 Espana',
  'MX': '🇲🇽 México',
  'GB': '🇬🇧 UK',
  'JP': '🇯🇵 Japan',
  'KR': '🇰🇷 Korea',
  'DE': '🇩🇪 Germany',
  'FR': '🇫🇷 France',
};

const Header = ({
  selectedRegion,
  onRegionChange,
  sidebarOpen,
  onToggleSidebar,
  regions,
  mapTheme,
  onToggleMapTheme,
  showTopThree,
  onToggleTopThree,
}) => {
  return (
    <header className="header" id="app-header">
      <div className="header-main">
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

        <div className="header-controls" aria-label="Global controls">
          <button
            className={`top-toggle ${showTopThree ? 'active' : ''}`}
            onClick={onToggleTopThree}
            aria-label={showTopThree ? 'Hide top 2 and top 3 songs' : 'Show top 3 songs'}
            id="top-toggle"
          >
            {showTopThree ? 'Top 3 On' : 'Top 3 Off'}
          </button>

          <button
            className={`theme-toggle ${mapTheme === 'light' ? 'light' : 'dark'}`}
            onClick={onToggleMapTheme}
            aria-label={`Switch to ${mapTheme === 'dark' ? 'light' : 'dark'} map theme`}
            id="map-theme-toggle"
          >
            {mapTheme === 'dark' ? 'Light Map' : 'Dark Map'}
          </button>
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

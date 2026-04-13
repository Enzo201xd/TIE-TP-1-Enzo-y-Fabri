import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SongCard from './SongCard';

// Create custom pulsing div icon — no image files needed
const createPulseIcon = (isSelected) => {
  return L.divIcon({
    className: '',
    html: `
      <div class="pulse-marker ${isSelected ? 'selected' : ''}">
        <div class="pulse-marker-halo"></div>
        <div class="pulse-marker-ring"></div>
        <div class="pulse-marker-ring"></div>
        <div class="pulse-marker-core"></div>
        <div class="pulse-marker-dot"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
};

const MapView = ({ songs, selectedSong, onSelectSong, mapTheme }) => {
  // Center on the Atlantic to comfortably show Americas, Europe, and Africa
  const center = [20, -20];
  const markerRefs = useRef({});
  const isDarkTheme = mapTheme !== 'light';

  const tileUrl = isDarkTheme
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const regionsWithTopSongs = Array.from(
    songs.reduce((groups, song) => {
      const regionCode = song.regionCode || song.id;
      if (!groups.has(regionCode)) {
        groups.set(regionCode, {
          regionCode,
          region: song.region,
          lat: song.lat,
          lng: song.lng,
          songs: [],
        });
      }
      groups.get(regionCode).songs.push(song);
      return groups;
    }, new Map()).values()
  ).map((regionEntry) => ({
    ...regionEntry,
    songs: [...regionEntry.songs].sort((a, b) => (a.rank || 99) - (b.rank || 99)).slice(0, 3),
  }));

  // When a song is selected from the sidebar, open its popup after fly animation
  useEffect(() => {
    if (selectedSong && markerRefs.current[selectedSong]) {
      const timer = setTimeout(() => {
        markerRefs.current[selectedSong].openPopup();
      }, 900);
      return () => clearTimeout(timer);
    }

    if (selectedSong) {
      const selected = songs.find((item) => item.id === selectedSong);
      const selectedRegionCode = selected?.regionCode || selected?.id;
      if (selectedRegionCode && markerRefs.current[selectedRegionCode]) {
        const timer = setTimeout(() => {
          markerRefs.current[selectedRegionCode].openPopup();
        }, 900);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedSong]);

  return (
    <div className={`map-container ${isDarkTheme ? 'map-dark' : 'map-light'}`} id="map-container">
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          key={mapTheme}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · CartoDB'
          url={tileUrl}
        />

        {regionsWithTopSongs.map((item) => (
          <Marker
            key={item.regionCode}
            position={[item.lat, item.lng]}
            icon={createPulseIcon(item.songs.some((song) => song.id === selectedSong))}
            ref={(ref) => {
              if (ref) markerRefs.current[item.regionCode] = ref;
            }}
            eventHandlers={{
              click: () => onSelectSong(item.songs[0]?.id),
            }}
          >
            <Popup>
              <div className="top3-popup-list">
                {item.songs.map((topSong) => (
                  <SongCard key={topSong.id} song={topSong} compact hideThumbnail />
                ))}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;

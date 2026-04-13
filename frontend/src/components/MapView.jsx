import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SongCard from './SongCard';

// Create custom pulsing div icon — no image files needed
const createPulseIcon = (isSelected) => {
  return L.divIcon({
    className: '',
    html: `
      <div class="pulse-marker ${isSelected ? 'selected' : ''}">
        <div class="pulse-marker-ring"></div>
        <div class="pulse-marker-ring"></div>
        <div class="pulse-marker-core"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
};

// Map panning controller — flies to selected marker
const MapController = ({ selectedSong, songs }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedSong) {
      const song = songs.find(s => s.id === selectedSong);
      if (song) {
        map.flyTo([song.lat, song.lng], 5, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
      }
    }
  }, [selectedSong, songs, map]);

  return null;
};

const MapView = ({ songs, selectedSong, onSelectSong }) => {
  // Center on the Atlantic to comfortably show Americas, Europe, and Africa
  const center = [20, -20];
  const markerRefs = useRef({});

  // When a song is selected from the sidebar, open its popup after fly animation
  useEffect(() => {
    if (selectedSong && markerRefs.current[selectedSong]) {
      const timer = setTimeout(() => {
        markerRefs.current[selectedSong].openPopup();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [selectedSong]);

  return (
    <div className="map-container" id="map-container">
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · CartoDB'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController selectedSong={selectedSong} songs={songs} />

        {songs.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={createPulseIcon(selectedSong === item.id)}
            ref={(ref) => {
              if (ref) markerRefs.current[item.id] = ref;
            }}
            eventHandlers={{
              click: () => onSelectSong(item.id),
            }}
          >
            <Popup>
              <SongCard song={item} compact />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;

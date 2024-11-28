import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MyLocationIcon from '@mui/icons-material/MyLocation';

// Configuration des icônes par défaut de Leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Composant pour mettre à jour la vue de la carte
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Composant pour gérer les événements de la carte
function MapEvents({ onLocationSelect }) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      if (onLocationSelect) {
        // Utiliser l'API de géocodage inverse pour obtenir l'adresse
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`)
          .then(response => response.json())
          .then(data => {
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address: data.display_name,
              details: data.address
            });
          })
          .catch(error => {
            console.error('Erreur lors de la récupération de l\'adresse:', error);
            onLocationSelect({
              latitude: lat,
              longitude: lng
            });
          });
      }
    }
  });
  return null;
}

const InteractiveMap = ({ items = [], onLocationSelect, initialCenter }) => {
  const [position, setPosition] = useState(initialCenter || [5.345317, -4.024429]); // Abidjan par défaut
  const zoom = 13;

  useEffect(() => {
    if (initialCenter) {
      setPosition(initialCenter);
    }
  }, [initialCenter]);

  const getMarkerColor = (type) => {
    switch (type) {
      case 'lost':
        return new L.Icon({
          ...DefaultIcon.options,
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
      case 'found':
        return new L.Icon({
          ...DefaultIcon.options,
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
      case 'selected':
        return new L.Icon({
          ...DefaultIcon.options,
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
      default:
        return DefaultIcon;
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={position} zoom={zoom} />
        <MapEvents onLocationSelect={onLocationSelect} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={getMarkerColor(item.type)}
          >
            <Popup>
              <Paper elevation={0}>
                <Typography variant="subtitle1" component="h3">
                  {item.name}
                </Typography>
                <Typography variant="body2">
                  {item.description}
                </Typography>
                {item.date && (
                  <Typography variant="caption" color="textSecondary">
                    {new Date(item.date).toLocaleDateString()}
                  </Typography>
                )}
              </Paper>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        <Typography variant="caption" sx={{ p: 1, display: 'block' }}>
          Cliquez sur la carte pour sélectionner un emplacement
        </Typography>
      </Box>
    </Box>
  );
};

export default InteractiveMap;

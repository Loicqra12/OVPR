import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/material';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuration de l'icône par défaut
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Styles pour la carte
const mapContainerStyle = {
  height: '500px',
  width: '100%',
  position: 'relative',
  zIndex: 0
};

// Composant pour la géolocalisation
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  React.useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker 
      position={position}
      icon={new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })}
    >
      <Popup>Vous êtes ici</Popup>
    </Marker>
  );
}

const MapView = ({ items = [] }) => {
  const position = [5.345317, -4.024429]; // Abidjan
  const zoom = 13;

  const getMarkerColor = (type) => {
    switch (type) {
      case 'lost':
        return new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: iconShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
      case 'found':
        return new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: iconShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
      default:
        return DefaultIcon;
    }
  };

  return (
    <Box sx={{ 
      height: '500px',
      width: '100%',
      position: 'relative',
      '& .leaflet-container': {
        height: '100%',
        width: '100%',
      }
    }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={mapContainerStyle}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {items.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={getMarkerColor(item.type)}
          >
            <Popup>
              <Typography variant="subtitle1">
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
              {item.status && (
                <Typography variant="caption" color="primary" display="block">
                  Statut: {item.status}
                </Typography>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default MapView;

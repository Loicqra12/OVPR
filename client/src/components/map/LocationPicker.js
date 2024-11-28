import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { TextField, Box, Button, Paper, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MyLocation as MyLocationIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const MapWrapper = styled(Box)(({ theme }) => ({
  height: '400px',
  width: '100%',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
  },
}));

// Composant pour mettre à jour la vue de la carte
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([14.6937, -17.4441]); // Coordonnées par défaut (Dakar)
  const [address, setAddress] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Fonction pour obtenir la position actuelle
  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = [position.coords.latitude, position.coords.longitude];
          setPosition(newPosition);
          // Reverse geocoding pour obtenir l'adresse
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          )
            .then(response => response.json())
            .then(data => {
              setAddress(data.display_name);
              onLocationSelect({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: data.display_name
              });
            })
            .finally(() => {
              setIsLocating(false);
            });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  // Demander la position automatiquement au chargement
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSearch = async () => {
    if (!address) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'adresse:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (lat, lon, displayName) => {
    const newPosition = [parseFloat(lat), parseFloat(lon)];
    setPosition(newPosition);
    setAddress(displayName);
    setSearchResults([]);
    onLocationSelect({
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      address: displayName
    });
  };

  return (
    <Box>
      <StyledPaper>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="subtitle1">
            Sélectionnez un emplacement
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MyLocationIcon />}
            onClick={getCurrentLocation}
            disabled={isLocating}
            size="small"
          >
            {isLocating ? 'Localisation...' : 'Ma position'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Entrez une adresse"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <IconButton onClick={handleSearch} disabled={isSearching}>
            <SearchIcon />
          </IconButton>
        </Box>

        {searchResults.length > 0 && (
          <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
            {searchResults.map((result, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => handleSelectLocation(result.lat, result.lon, result.display_name)}
              >
                <Typography variant="body2">{result.display_name}</Typography>
              </Box>
            ))}
          </Paper>
        )}
      </StyledPaper>

      <MapWrapper>
        <MapContainer
          center={position}
          zoom={16}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker 
            position={position}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
                )
                  .then(response => response.json())
                  .then(data => {
                    setAddress(data.display_name);
                    onLocationSelect({
                      lat: position.lat,
                      lng: position.lng,
                      address: data.display_name
                    });
                  });
              },
            }}
          />
          <MapUpdater center={position} />
        </MapContainer>
      </MapWrapper>
    </Box>
  );
};

export default LocationPicker;

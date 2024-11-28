import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Alert,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';
import { GoogleMap, Marker, LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState(initialLocation || {
    lat: 5.3484716, // Coordonnées par défaut (Abidjan)
    lng: -4.0147219
  });
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  const onLoad = useCallback((map) => {
    setMap(map);
    if (initialLocation) {
      setMarker(initialLocation);
    }
  }, [initialLocation]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onLoadAutocomplete = (autocomplete) => {
    setSearchBox(autocomplete);
  };

  const onPlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setCenter(newLocation);
        setMarker(newLocation);
        setAddress(place.formatted_address);
        onLocationSelect(newLocation, place.formatted_address);
      }
    }
  };

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarker(newLocation);
    
    // Reverse geocoding pour obtenir l'adresse
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newLocation }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
          onLocationSelect(newLocation, results[0].formatted_address);
        }
      }
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setErrorMessage('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(newLocation);
          setMarker(newLocation);

          // Reverse geocoding pour obtenir l'adresse
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: newLocation }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setAddress(results[0].formatted_address);
              onLocationSelect(newLocation, results[0].formatted_address);
            }
          });
        },
        (error) => {
          setErrorMessage('Impossible d\'obtenir votre position. Veuillez vérifier vos paramètres de localisation.');
        }
      );
    } else {
      setErrorMessage('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="VOTRE_CLE_API_GOOGLE_MAPS"
      libraries={libraries}
    >
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Localisation de l'incident
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Autocomplete
            onLoad={onLoadAutocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <TextField
              fullWidth
              placeholder="Rechercher une adresse..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Autocomplete>
          <Button
            variant="contained"
            startIcon={<MyLocationIcon />}
            onClick={getCurrentLocation}
          >
            Ma position
          </Button>
        </Box>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
        >
          {marker && (
            <Marker
              position={marker}
              animation={window.google.maps.Animation.DROP}
            />
          )}
        </GoogleMap>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {address || 'Cliquez sur la carte pour sélectionner un emplacement'}
        </Typography>
      </Paper>
    </LoadScript>
  );
};

export default LocationPicker;

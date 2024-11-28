import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import InteractiveMap from '../maps/InteractiveMap';

const LocationSelector = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [mapCenter, setMapCenter] = useState([5.345317, -4.024429]); // Abidjan par défaut

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      if (initialLocation.latitude && initialLocation.longitude) {
        setMapCenter([initialLocation.latitude, initialLocation.longitude]);
      }
    }
  }, [initialLocation]);

  const getCurrentLocation = () => {
    setLocationError('');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Utiliser un proxy CORS ou une API backend sécurisée
            const response = await fetch(
              `/api/geocode?lat=${latitude}&lon=${longitude}`
            );
            
            if (!response.ok) {
              throw new Error('Erreur lors de la géolocalisation');
            }
            
            const data = await response.json();
            
            const locationData = {
              latitude,
              longitude,
              address: data.display_name || 'Adresse non trouvée',
              details: data.address || {}
            };
            
            setUserLocation(locationData);
            setSelectedLocation(locationData);
            setMapCenter([latitude, longitude]);
            
            if (onLocationSelect) {
              onLocationSelect(locationData);
            }
          } catch (error) {
            console.error('Erreur de géolocalisation:', error);
            setLocationError('Impossible de récupérer votre position. Veuillez réessayer.');
          }
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setLocationError('Impossible d\'accéder à votre position. Veuillez vérifier vos paramètres de localisation.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  const handleMapLocationSelect = (location) => {
    setSelectedLocation(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<MyLocationIcon />}
            onClick={getCurrentLocation}
            fullWidth
          >
            Utiliser ma position actuelle
          </Button>
        </Grid>
        
        {locationError && (
          <Grid item xs={12}>
            <Alert severity="error">{locationError}</Alert>
          </Grid>
        )}

        {selectedLocation && (
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Position sélectionnée :
              </Typography>
              <Typography variant="body2">
                {selectedLocation.address || `${selectedLocation.latitude}, ${selectedLocation.longitude}`}
              </Typography>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} sx={{ height: '400px' }}>
          <InteractiveMap
            initialCenter={mapCenter}
            onLocationSelect={handleMapLocationSelect}
            items={selectedLocation ? [{
              id: 'selected',
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              name: 'Position sélectionnée',
              description: selectedLocation.address,
              type: 'selected'
            }] : []}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationSelector;

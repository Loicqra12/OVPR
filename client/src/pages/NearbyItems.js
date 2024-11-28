import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InteractiveMap from '../components/maps/InteractiveMap';

const NearbyItems = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyItems, setNearbyItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(5); // rayon en kilomètres

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          
          // TODO: Remplacer par un appel API réel
          const mockNearbyItems = [
            {
              id: 1,
              name: 'iPhone 13',
              type: 'lost',
              description: 'Perdu hier soir',
              latitude: latitude + 0.002,
              longitude: longitude + 0.002,
              date: new Date(),
              status: 'lost'
            },
            {
              id: 2,
              name: 'Sac à main',
              type: 'found',
              description: 'Trouvé ce matin',
              latitude: latitude - 0.001,
              longitude: longitude - 0.001,
              date: new Date(),
              status: 'found'
            }
          ];
          
          setNearbyItems(mockNearbyItems);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setError("Vous devez autoriser l'accès à votre position");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Position non disponible");
              break;
            case error.TIMEOUT:
              setError("Délai d'attente dépassé");
              break;
            default:
              setError("Une erreur est survenue");
          }
        }
      );
    } else {
      setLoading(false);
      setError("La géolocalisation n'est pas supportée par votre navigateur");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'lost':
        return 'error';
      case 'found':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'lost':
        return 'Perdu';
      case 'found':
        return 'Trouvé';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Objets aux alentours
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '500px', p: 0, overflow: 'hidden' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <InteractiveMap
                items={nearbyItems}
                initialCenter={userLocation ? [userLocation.latitude, userLocation.longitude] : undefined}
              />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Votre position
            </Typography>
            <Button
              startIcon={<LocationOnIcon />}
              variant="contained"
              onClick={getCurrentLocation}
              fullWidth
            >
              Actualiser ma position
            </Button>
          </Paper>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Objets à proximité
          </Typography>
          
          {nearbyItems.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Chip
                    label={getStatusLabel(item.status)}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {new Date(item.date).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Voir les détails</Button>
                <Button size="small" color="primary">
                  Contacter
                </Button>
              </CardActions>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default NearbyItems;

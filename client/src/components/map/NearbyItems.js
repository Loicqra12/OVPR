import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Map as MapIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useAuth } from '../../contexts/AuthContext';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '70vh',
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

const NearbyItems = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { user } = useAuth();
  const [center, setCenter] = useState({ lat: 14.6937, lng: -17.4441 }); // Coordonnées de Dakar
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [radius, setRadius] = useState(10);
  const [map, setMap] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    category: [],
    date: 'all',
  });
  const [searchValue, setSearchValue] = useState('');
  const [savedSearches, setSavedSearches] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);

  const categories = [
    "Documents administratifs",
    "Cartes d'identité",
    "Passeports",
    "Permis de conduire",
    "Cartes bancaires",
    "Clés",
    "Téléphones",
    "Ordinateurs",
    "Tablettes",
    "Sacs",
    "Portefeuilles",
    "Bijoux",
    "Montres",
    "Lunettes",
    "Vêtements",
    "Chaussures",
    "Livres",
    "Cahiers",
    "Matériel scolaire",
    "Instruments de musique",
    "Appareils photo",
    "Écouteurs/Casques",
    "Cartes de transport",
    "Bagages",
    "Équipements sportifs",
    "Certificats",
    "Diplômes",
    "Cartes professionnelles",
    "Badges d'accès",
    "Dossiers médicaux"
  ];

  // Fonction pour charger la carte
  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  // Fonction pour décharger la carte
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log('Error getting location');
        }
      );
    }

    // Fetch items data
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      // Mock data for now
      const mockItems = [
        {
          id: 1,
          name: 'iPhone 12',
          status: 'volé',
          category: 'Électronique',
          description: 'iPhone 12 noir, 128GB',
          location: { lat: 45.508888, lng: -73.561668 },
          date: new Date(),
          image: 'https://example.com/iphone.jpg',
        },
        // Add more mock items...
      ];
      setMarkers(mockItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case 'volé':
        return 'red';
      case 'perdu':
        return 'blue';
      case 'oublié':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const handleRadiusChange = (event, newValue) => {
    setRadius(newValue);
    // Refetch items with new radius
    fetchItems();
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    // Refetch items with new filters
    fetchItems();
  };

  const handleSaveSearch = () => {
    const newSearch = {
      id: Date.now(),
      filters: { ...filters },
      radius,
      center,
    };
    setSavedSearches((prev) => [...prev, newSearch]);
  };

  const handleShareItem = (item) => {
    // Implement sharing functionality
    console.log('Sharing item:', item);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Search and Filters Section */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recherche
            </Typography>
            <TextField
              fullWidth
              placeholder="Rechercher un lieu..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography>Rayon de recherche: {radius} km</Typography>
              <Slider
                value={radius}
                onChange={handleRadiusChange}
                min={1}
                max={50}
                valueLabelDisplay="auto"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filtres
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                multiple
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="volé">Volé</MenuItem>
                <MenuItem value="perdu">Perdu</MenuItem>
                <MenuItem value="oublié">Oublié</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                multiple
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Date</InputLabel>
              <Select
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              >
                <MenuItem value="all">Toutes les dates</MenuItem>
                <MenuItem value="today">Aujourd'hui</MenuItem>
                <MenuItem value="week">Cette semaine</MenuItem>
                <MenuItem value="month">Ce mois-ci</MenuItem>
              </Select>
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSearch}
              sx={{ mt: 2 }}
            >
              Sauvegarder la recherche
            </Button>
          </Paper>
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={13}
              center={center}
              options={options}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.location}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: getMarkerColor(marker.status),
                    fillOpacity: 1,
                    strokeWeight: 1,
                    scale: 10,
                  }}
                  onClick={() => setSelectedMarker(marker)}
                />
              ))}

              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker.location}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={selectedMarker.image}
                      alt={selectedMarker.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{selectedMarker.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedMarker.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={selectedMarker.status}
                          color={
                            selectedMarker.status === 'volé'
                              ? 'error'
                              : selectedMarker.status === 'perdu'
                              ? 'primary'
                              : 'warning'
                          }
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={selectedMarker.category}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      <Button
                        startIcon={<ShareIcon />}
                        onClick={() => handleShareItem(selectedMarker)}
                        sx={{ mt: 1 }}
                      >
                        Partager
                      </Button>
                    </CardContent>
                  </Card>
                </InfoWindow>
              )}
            </GoogleMap>
          </Paper>

          {/* Popular and Recent Items */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <StarIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                  Objets populaires
                </Typography>
                {/* Add popular items list */}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <TimeIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                  Objets récents
                </Typography>
                {/* Add recent items list */}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NearbyItems;

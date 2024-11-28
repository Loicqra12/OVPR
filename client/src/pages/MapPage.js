import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import InteractiveMap from '../components/maps/InteractiveMap';
import LocationSelector from '../components/location/LocationSelector';

const MapPage = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    startDate: null,
    endDate: null,
    category: 'all',
    radius: 5,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Charger les objets depuis l'API
    // Cette fonction sera appelée à chaque changement de filtres
    const fetchItems = async () => {
      setLoading(true);
      try {
        // Simulation d'appel API
        const mockItems = [
          {
            id: 1,
            type: 'lost',
            name: 'iPhone 12',
            description: 'iPhone 12 noir perdu vers Cocody',
            latitude: 5.348827,
            longitude: -4.015546,
            date: '2024-01-15',
            category: 'Téléphone'
          },
          {
            id: 2,
            type: 'found',
            name: 'Portefeuille',
            description: 'Portefeuille marron trouvé à Plateau',
            latitude: 5.345317,
            longitude: -4.024429,
            date: '2024-01-16',
            category: 'Portefeuille'
          },
        ];
        setItems(mockItems);
      } catch (error) {
        console.error('Erreur lors du chargement des objets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [filters, selectedLocation]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Carte des objets perdus et trouvés
      </Typography>

      <Grid container spacing={3}>
        {/* Filtres */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filtres
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type d'objet</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  label="Type d'objet"
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="lost">Perdus</MenuItem>
                  <MenuItem value="found">Trouvés</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date de début"
                  value={filters.startDate}
                  onChange={(newValue) => handleFilterChange('startDate', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  sx={{ mb: 2 }}
                />
                <DatePicker
                  label="Date de fin"
                  value={filters.endDate}
                  onChange={(newValue) => handleFilterChange('endDate', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  label="Catégorie"
                >
                  <MenuItem value="all">Toutes</MenuItem>
                  <MenuItem value="phone">Téléphones</MenuItem>
                  <MenuItem value="wallet">Portefeuilles</MenuItem>
                  <MenuItem value="keys">Clés</MenuItem>
                  <MenuItem value="documents">Documents</MenuItem>
                  <MenuItem value="other">Autres</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Rayon de recherche (km)"
                value={filters.radius}
                onChange={(e) => handleFilterChange('radius', e.target.value)}
                InputProps={{ inputProps: { min: 1, max: 100 } }}
              />
            </Box>

            <LocationSelector onLocationSelect={handleLocationSelect} />

            {selectedLocation && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Zone de recherche :
                </Typography>
                <Chip
                  label={`${filters.radius} km autour de ${selectedLocation.address || 'la position sélectionnée'}`}
                  onDelete={() => setSelectedLocation(null)}
                  sx={{ mt: 1 }}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Carte */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, height: '700px' }}>
            <InteractiveMap
              items={items}
              onLocationSelect={handleLocationSelect}
              initialCenter={selectedLocation ? [selectedLocation.latitude, selectedLocation.longitude] : undefined}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MapPage;

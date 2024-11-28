import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Chip,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const InteractiveMap = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState('all');

  // Simuler des marqueurs sur la carte
  const markers = [
    { id: 1, type: 'lost', lat: 48.8566, lng: 2.3522, title: 'iPhone perdu' },
    { id: 2, type: 'found', lat: 48.8584, lng: 2.2945, title: 'Clés trouvées' },
    { id: 3, type: 'stolen', lat: 48.8737, lng: 2.295, title: 'Vélo volé' },
  ];

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          Carte Interactive
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filtrer</InputLabel>
            <Select
              value={filter}
              label="Filtrer"
              onChange={handleFilterChange}
              startAdornment={<FilterIcon sx={{ mr: 1 }} />}
            >
              <MenuItem value="all">Tout</MenuItem>
              <MenuItem value="lost">Perdus</MenuItem>
              <MenuItem value="found">Trouvés</MenuItem>
              <MenuItem value="stolen">Volés</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<LocationIcon />}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
              },
            }}
          >
            Ma position
          </Button>
        </Box>
      </Box>

      {/* Placeholder pour la carte */}
      <Box
        sx={{
          width: '100%',
          height: 400,
          bgcolor: '#e5e5e5',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Carte en cours de chargement...
        </Typography>

        {/* Légende */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            p: 1,
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Légende
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              size="small"
              label="Perdu"
              sx={{ bgcolor: '#f44336', color: 'white' }}
            />
            <Chip
              size="small"
              label="Trouvé"
              sx={{ bgcolor: '#4caf50', color: 'white' }}
            />
            <Chip
              size="small"
              label="Volé"
              sx={{ bgcolor: '#ff9800', color: 'white' }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Conseil : Cliquez sur un marqueur pour voir les détails de l'annonce
        </Typography>
      </Box>
    </Paper>
  );
};

export default InteractiveMap;

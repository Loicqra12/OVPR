import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Typography,
  Chip,
  Grid,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const itemConditions = [
  { value: 'new', label: 'Neuf' },
  { value: 'excellent', label: 'Excellent état' },
  { value: 'good', label: 'Bon état' },
  { value: 'fair', label: 'État moyen' },
  { value: 'poor', label: 'Mauvais état' },
];

const itemColors = [
  'noir', 'blanc', 'gris', 'rouge', 'bleu', 'vert', 
  'jaune', 'orange', 'violet', 'marron', 'beige', 'rose'
];

const SearchFilters = ({ filters, onFilterChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

  const handleSliderChange = (name) => (event, value) => {
    onFilterChange(name, value);
  };

  const handleDateChange = (name) => (date) => {
    onFilterChange(name, date);
  };

  const handleMultipleChange = (name) => (event, values) => {
    onFilterChange(name, values);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>État</InputLabel>
            <Select
              name="condition"
              value={filters.condition || ''}
              onChange={handleChange}
              label="État"
            >
              <MenuItem value="">Tous les états</MenuItem>
              {itemConditions.map((condition) => (
                <MenuItem key={condition.value} value={condition.value}>
                  {condition.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={itemColors}
            value={filters.colors || []}
            onChange={handleMultipleChange('colors')}
            renderInput={(params) => (
              <TextField {...params} label="Couleurs" placeholder="Sélectionner des couleurs" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label="Date de perte/découverte après le"
            value={filters.dateFrom || null}
            onChange={handleDateChange('dateFrom')}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label="Date de perte/découverte avant le"
            value={filters.dateTo || null}
            onChange={handleDateChange('dateTo')}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>
            Valeur estimée (€)
          </Typography>
          <Slider
            value={filters.priceRange || [0, 1000]}
            onChange={handleSliderChange('priceRange')}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
            step={50}
            marks={[
              { value: 0, label: '0€' },
              { value: 250, label: '250€' },
              { value: 500, label: '500€' },
              { value: 750, label: '750€' },
              { value: 1000, label: '1000€+' },
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Trier par</InputLabel>
            <Select
              name="sortBy"
              value={filters.sortBy || 'date'}
              onChange={handleChange}
              label="Trier par"
            >
              <MenuItem value="date">Date (Plus récent)</MenuItem>
              <MenuItem value="-date">Date (Plus ancien)</MenuItem>
              <MenuItem value="distance">Distance (Plus proche)</MenuItem>
              <MenuItem value="-distance">Distance (Plus éloigné)</MenuItem>
              <MenuItem value="value">Valeur (Plus élevée)</MenuItem>
              <MenuItem value="-value">Valeur (Plus basse)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchFilters;

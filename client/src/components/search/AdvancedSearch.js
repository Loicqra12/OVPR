import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import LocationSelector from '../location/LocationSelector';

const categories = [
  'Tous',
  'Documents',
  'Électronique',
  'Bijoux',
  'Vêtements',
  'Clés',
  'Animaux',
  'Autres'
];

const AdvancedSearch = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    keyword: '',
    category: 'Tous',
    startDate: null,
    endDate: null,
    location: null,
    radius: 10,
    status: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));

    // Mise à jour des filtres actifs
    if (value && value !== 'Tous' && value !== 'all') {
      setActiveFilters(prev => {
        const newFilters = prev.filter(f => f.field !== field);
        return [...newFilters, { field, value }];
      });
    } else {
      setActiveFilters(prev => prev.filter(f => f.field !== field));
    }
  };

  const handleSearch = () => {
    // Implémenter la logique de recherche ici
    console.log('Recherche avec les filtres:', filters);
  };

  const handleRemoveFilter = (field) => {
    handleFilterChange(field, field === 'category' ? 'Tous' : null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Barre de recherche principale */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('search.placeholder')}
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LocationSelector
            value={filters.location}
            onChange={(location) => handleFilterChange('location', location)}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            {t('search.button')}
          </Button>
        </Grid>
      </Grid>

      {/* Bouton pour afficher/masquer les filtres avancés */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
          color="primary"
        >
          {showFilters ? t('search.hideFilters') : t('search.showFilters')}
        </Button>
        <Box sx={{ ml: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {activeFilters.map(({ field, value }) => (
            <Chip
              key={field}
              label={`${t(`search.${field}`)}: ${value}`}
              onDelete={() => handleRemoveFilter(field)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      {/* Filtres avancés */}
      {showFilters && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>{t('search.category')}</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {t(`categories.${category.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label={t('search.startDate')}
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label={t('search.endDate')}
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  {t('search.radius')} : {filters.radius} km
                </Typography>
                <Slider
                  value={filters.radius}
                  onChange={(e, value) => handleFilterChange('radius', value)}
                  min={1}
                  max={100}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: 1, label: '1km' },
                    { value: 50, label: '50km' },
                    { value: 100, label: '100km' },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('search.status')}</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="all">{t('search.statusAll')}</MenuItem>
                    <MenuItem value="lost">{t('search.statusLost')}</MenuItem>
                    <MenuItem value="found">{t('search.statusFound')}</MenuItem>
                    <MenuItem value="returned">{t('search.statusReturned')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AdvancedSearch;

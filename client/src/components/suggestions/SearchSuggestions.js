import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Paper,
  Box,
  Chip,
} from '@mui/material';
import {
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Category as CategoryIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const SearchSuggestions = ({ onSuggestionClick }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [nearbyLocations, setNearbyLocations] = useState([]);

  useEffect(() => {
    // Charger l'historique des recherches depuis le localStorage
    const loadRecentSearches = () => {
      try {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        return [];
      }
    };

    // Charger les recherches tendances depuis l'API
    const fetchTrendingSearches = async () => {
      try {
        const response = await fetch('/api/search/trending');
        if (response.ok) {
          const data = await response.json();
          setTrendingSearches(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tendances:', error);
      }
    };

    // Charger les catégories populaires
    const fetchPopularCategories = async () => {
      try {
        const response = await fetch('/api/categories/popular');
        if (response.ok) {
          const data = await response.json();
          setPopularCategories(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };

    // Charger les emplacements à proximité
    const fetchNearbyLocations = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `/api/locations/nearby?lat=${latitude}&lng=${longitude}`
            );
            if (response.ok) {
              const data = await response.json();
              setNearbyLocations(data);
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des emplacements:', error);
      }
    };

    setRecentSearches(loadRecentSearches());
    fetchTrendingSearches();
    fetchPopularCategories();
    fetchNearbyLocations();
  }, []);

  const handleSuggestionClick = (suggestion, type) => {
    // Sauvegarder dans l'historique si c'est une nouvelle recherche
    if (type !== 'recent') {
      const newRecentSearches = [
        { text: suggestion.text || suggestion.name, type },
        ...recentSearches.filter((s) => s.text !== (suggestion.text || suggestion.name)),
      ].slice(0, 10);

      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    }

    if (onSuggestionClick) {
      onSuggestionClick(suggestion, type);
    }
  };

  const renderSection = (title, icon, items, type) => {
    if (!items || items.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
            color: 'text.secondary',
          }}
        >
          {icon}
          {title}
        </Typography>
        {type === 'category' ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {items.map((item, index) => (
              <Chip
                key={index}
                label={item.name}
                onClick={() => handleSuggestionClick(item, type)}
                icon={<CategoryIcon />}
                variant="outlined"
                clickable
              />
            ))}
          </Box>
        ) : (
          <List dense>
            {items.map((item, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(item, type)}
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {type === 'recent' && <HistoryIcon color="action" />}
                  {type === 'trending' && <TrendingIcon color="primary" />}
                  {type === 'location' && <LocationIcon color="error" />}
                </ListItemIcon>
                <ListItemText
                  primary={item.text || item.name}
                  secondary={item.count && `${item.count} résultats`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      {renderSection(
        'Recherches récentes',
        <HistoryIcon />,
        recentSearches,
        'recent'
      )}
      {renderSection(
        'Tendances',
        <TrendingIcon />,
        trendingSearches,
        'trending'
      )}
      {renderSection(
        'Catégories populaires',
        <CategoryIcon />,
        popularCategories,
        'category'
      )}
      {renderSection(
        'À proximité',
        <LocationIcon />,
        nearbyLocations,
        'location'
      )}
    </Paper>
  );
};

export default SearchSuggestions;

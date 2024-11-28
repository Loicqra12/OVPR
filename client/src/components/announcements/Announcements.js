import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  Divider,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Flag as FlagIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ImageGallery from '../item/ImageGallery';
import { categories } from '../../data/categories';

const statusColors = {
  volé: 'error',
  perdu: 'primary',
  oublié: 'warning',
  retrouvé: 'success',
};

const statusLabels = {
  volé: 'Volé',
  perdu: 'Perdu',
  oublié: 'Oublié',
  retrouvé: 'Retrouvé',
};

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    category: [],
    location: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [reportDialog, setReportDialog] = useState({ open: false, announcement: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Charger les annonces (mock data pour l'instant)
    const mockAnnouncements = [
      {
        id: 1,
        title: 'iPhone 12 Pro perdu',
        description: 'iPhone 12 Pro noir, 256GB, perdu près de la gare',
        status: 'perdu',
        category: 'Téléphones',
        date: new Date(),
        location: 'Gare centrale',
        images: ['url_image1', 'url_image2'],
        userId: 'user1',
      },
      // Ajoutez plus d'annonces mock ici
    ];
    setAnnouncements(mockAnnouncements);
    setFilteredAnnouncements(mockAnnouncements);
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [searchQuery, filters, currentTab, announcements]);

  const filterAnnouncements = () => {
    let filtered = [...announcements];

    // Filtre par statut si un onglet spécifique est sélectionné
    if (currentTab !== 'all') {
      filtered = filtered.filter(item => item.status === currentTab);
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // Filtre par statut sélectionné
    if (filters.status.length > 0) {
      filtered = filtered.filter(item => filters.status.includes(item.status));
    }

    // Filtre par catégorie
    if (filters.category.length > 0) {
      filtered = filtered.filter(item => filters.category.includes(item.category));
    }

    // Filtre par localisation
    if (filters.location) {
      filtered = filtered.filter(item =>
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredAnnouncements(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const toggleFavorite = (announcement) => {
    const isFavorite = favorites.includes(announcement.id);
    if (isFavorite) {
      setFavorites(prev => prev.filter(id => id !== announcement.id));
    } else {
      setFavorites(prev => [...prev, announcement.id]);
    }
    setSnackbar({
      open: true,
      message: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      severity: 'success',
    });
  };

  const handleShare = (announcement) => {
    // Implémenter le partage
    console.log('Partage de l\'annonce:', announcement);
  };

  const handleReport = (announcement) => {
    setReportDialog({ open: true, announcement });
  };

  const submitReport = (reason, details) => {
    // Implémenter l'envoi du signalement
    console.log('Signalement:', { announcement: reportDialog.announcement, reason, details });
    setReportDialog({ open: false, announcement: null });
    setSnackbar({
      open: true,
      message: 'Signalement envoyé avec succès',
      severity: 'success',
    });
  };

  const getStatusCount = (status) => {
    return announcements.filter(item => item.status === status).length;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête avec recherche et filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher une annonce..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              variant="outlined"
              fullWidth
            >
              Filtres
            </Button>
          </Grid>
        </Grid>

        {/* Panneau de filtres */}
        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    multiple
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={statusLabels[value]}
                            color={statusColors[value]}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    multiple
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
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
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Localisation"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  InputProps={{
                    endAdornment: <LocationIcon color="action" />,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Onglets de statut */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={
              <Badge badgeContent={announcements.length} color="default">
                Tout
              </Badge>
            }
            value="all"
          />
          {Object.entries(statusLabels).map(([value, label]) => (
            <Tab
              key={value}
              label={
                <Badge badgeContent={getStatusCount(value)} color={statusColors[value]}>
                  {label}
                </Badge>
              }
              value={value}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Liste des annonces */}
      <Grid container spacing={3}>
        {filteredAnnouncements.map((announcement) => (
          <Grid item xs={12} sm={6} md={4} key={announcement.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={announcement.images[0]}
                alt={announcement.title}
                onClick={() => setSelectedAnnouncement(announcement)}
                sx={{ cursor: 'pointer' }}
              />
              <CardContent>
                <Typography variant="h6" noWrap>
                  {announcement.title}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={statusLabels[announcement.status]}
                    color={statusColors[announcement.status]}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip label={announcement.category} variant="outlined" size="small" />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {announcement.description}
                </Typography>
                {announcement.location && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {announcement.location}
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => toggleFavorite(announcement)}
                  color={favorites.includes(announcement.id) ? 'primary' : 'default'}
                >
                  {favorites.includes(announcement.id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton onClick={() => handleShare(announcement)}>
                  <ShareIcon />
                </IconButton>
                <IconButton onClick={() => handleReport(announcement)} color="error">
                  <FlagIcon />
                </IconButton>
                {announcement.status !== 'retrouvé' && user && (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    sx={{ ml: 'auto' }}
                  >
                    Déclarer comme retrouvé
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialogue de signalement */}
      <Dialog
        open={reportDialog.open}
        onClose={() => setReportDialog({ open: false, announcement: null })}
      >
        <DialogTitle>Signaler une annonce</DialogTitle>
        <DialogContent>
          {/* Ajouter le formulaire de signalement ici */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialog({ open: false, announcement: null })}>
            Annuler
          </Button>
          <Button onClick={() => submitReport('spam', 'Contenu inapproprié')} color="error">
            Signaler
          </Button>
        </DialogActions>
      </Dialog>

      {/* Galerie d'images */}
      <Dialog
        open={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedAnnouncement && (
          <>
            <DialogTitle>{selectedAnnouncement.title}</DialogTitle>
            <DialogContent>
              <ImageGallery images={selectedAnnouncement.images} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedAnnouncement.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedAnnouncement(null)}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Announcements;

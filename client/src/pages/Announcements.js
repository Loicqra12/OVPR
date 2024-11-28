import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  Alert,
  CircularProgress,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import SearchIcon from '@mui/icons-material/Search';
import { announcementService } from '../services/announcementService';
import ProductGallery from '../components/product/ProductGallery';
import logo from '../assets/logoovpr.PNG';
import detective from '../assets/detective.png.png';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'volé':
    case 'vole':
      return 'error';
    case 'perdu':
      return 'primary';
    case 'oublié':
    case 'oublie':
      return 'warning';
    case 'retrouvé':
    case 'trouve':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status.toLowerCase()) {
    case 'volé':
    case 'vole':
      return 'Volé';
    case 'perdu':
      return 'Perdu';
    case 'oublié':
    case 'oublie':
      return 'Oublié';
    case 'retrouvé':
    case 'trouve':
      return 'Retrouvé';
    default:
      return status;
  }
};

const AnnouncementDetails = ({ announcement, open, onClose }) => {
  const theme = useTheme();

  if (!announcement) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={announcement.images && announcement.images.length > 0 ? announcement.images[0].url : detective}
              alt={announcement.images?.[0]?.alt || 'Image de l\'annonce'}
              sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {announcement.name}
            </Typography>
            <Chip
              label={getStatusLabel(announcement.status)}
              color={getStatusColor(announcement.status)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" paragraph>
              {announcement.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Catégorie:</strong> {announcement.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Localisation:</strong> {announcement.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Date:</strong> {announcement.lastSeen || announcement.foundDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Contact:</strong> {announcement.contact}
            </Typography>
            {announcement.reward && (
              <Typography variant="body2" color="text.secondary">
                <strong>Récompense:</strong> {announcement.reward} FCFA
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const Announcements = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    searchQuery: '',
  });

  useEffect(() => {
    loadAnnouncements();
  }, [filters]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncements(filters);
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      console.error('Error loading announcements:', err);
      setError('Une erreur est survenue lors du chargement des annonces.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleCloseDetails = () => {
    setSelectedAnnouncement(null);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <img src={logo} alt="Logo OVPR" style={{ height: '100px' }} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Annonces
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Consultez les dernières annonces d'objets perdus, volés ou oubliés
        </Typography>
      </Box>

      {/* Filtres */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.status}
                label="Statut"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="vole">Volé</MenuItem>
                <MenuItem value="perdu">Perdu</MenuItem>
                <MenuItem value="oublie">Oublié</MenuItem>
                <MenuItem value="retrouve">Retrouvé</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={filters.category}
                label="Catégorie"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">Toutes</MenuItem>
                <MenuItem value="Électronique">Électronique</MenuItem>
                <MenuItem value="Documents">Documents</MenuItem>
                <MenuItem value="Accessoires">Accessoires</MenuItem>
                <MenuItem value="Bagagerie">Bagagerie</MenuItem>
                <MenuItem value="Transport">Transport</MenuItem>
                <MenuItem value="Vêtements">Vêtements</MenuItem>
                <MenuItem value="Livres">Livres</MenuItem>
                <MenuItem value="Clés">Clés</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des annonces */}
      <Grid container spacing={3}>
        {announcements.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">Aucune annonce ne correspond à vos critères de recherche.</Alert>
          </Grid>
        ) : (
          announcements.map((announcement) => (
            <Grid item xs={12} sm={6} md={4} key={announcement.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleAnnouncementClick(announcement)}
              >
                {announcement.images && announcement.images[0] ? (
                  <CardMedia
                    component="img"
                    image={announcement.images[0].url}
                    alt={announcement.images[0].alt}
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                    }}
                  >
                    <NoPhotographyIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {announcement.name}
                    </Typography>
                    <Chip
                      label={getStatusLabel(announcement.status)}
                      color={getStatusColor(announcement.status)}
                      size="small"
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {announcement.description}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Lieu:</strong> {announcement.location}
                    </Typography>
                    {announcement.lastSeen && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Date:</strong> {new Date(announcement.lastSeen).toLocaleDateString('fr-FR')}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Modal de détails */}
      <AnnouncementDetails
        announcement={selectedAnnouncement}
        open={Boolean(selectedAnnouncement)}
        onClose={handleCloseDetails}
      />
    </Container>
  );
};

export default Announcements;

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Button,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  LocalOffer as LocalOfferIcon,
  ColorLens as ColorLensIcon,
  Straighten as StraightenIcon,
  Scale as ScaleIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import ImageGallery from '../item/ImageGallery';

const ItemDetails = ({ item, open, onClose }) => {
  if (!item) return null;

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 FCFA';
    return `${amount.toLocaleString()} FCFA`;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      perdu: '#d32f2f',
      oublie: '#1976d2',
      vole: '#f57c00',
      retrouve: '#2e7d32',
    };
    return statusColors[status?.toLowerCase()] || '#757575';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        pb: 2
      }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {item.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Image de l'objet */}
          <Grid item xs={12} md={6}>
            {item.images && item.images.length > 0 ? (
              <Box sx={{ 
                height: 300,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
              }}>
                <ImageGallery images={item.images} />
              </Box>
            ) : (
              <Box
                component="img"
                src={item.image || '/placeholder-image.jpg'}
                alt={item.name}
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            )}
          </Grid>

          {/* Informations principales */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Chip
                label={item.status?.toUpperCase()}
                sx={{
                  bgcolor: getStatusColor(item.status),
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2
                }}
              />
              
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalOfferIcon color="primary" />
                Valeur estimée: {formatCurrency(item.purchasePrice)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Caractéristiques de l'objet */}
            <Typography variant="h6" gutterBottom>
              Caractéristiques
            </Typography>
            <Grid container spacing={2}>
              {item.category && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon color="action" />
                    <Typography>Catégorie: {item.category}</Typography>
                  </Box>
                </Grid>
              )}
              {item.color && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ColorLensIcon color="action" />
                    <Typography>Couleur: {item.color}</Typography>
                  </Box>
                </Grid>
              )}
              {item.dimensions && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StraightenIcon color="action" />
                    <Typography>Dimensions: {item.dimensions}</Typography>
                  </Box>
                </Grid>
              )}
              {item.weight && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScaleIcon color="action" />
                    <Typography>Poids: {item.weight}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Détails de l'incident */}
            <Typography variant="h6" gutterBottom>
              Détails de l'incident
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon color="action" />
                  <Typography>Date: {formatDate(item.date)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="action" />
                  <Typography>Lieu: {item.location}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <DescriptionIcon color="action" sx={{ mt: 0.5 }} />
                  <Typography>Description: {item.description}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Informations de contact */}
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="action" />
                  <Typography>Déclaré par: {item.owner}</Typography>
                </Box>
              </Grid>
              {item.contact && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<PhoneIcon />}
                    fullWidth
                    href={`tel:${item.contact}`}
                    sx={{ mb: 1 }}
                  >
                    Appeler
                  </Button>
                </Grid>
              )}
              {item.email && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    fullWidth
                    href={`mailto:${item.email}`}
                  >
                    Envoyer un email
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetails;

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Button,
  alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ItemStatusButtons from './ItemStatusButtons';
import ImageGallery from '../item/ImageGallery';

const ItemCard = ({ 
  item, 
  onStatusChange, 
  showContact = false,
  showLocation = false,
  showDate = false
}) => {
  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    const statusColors = {
      perdu: '#d32f2f',
      oublie: '#1976d2',
      vole: '#f57c00',
      retrouve: '#2e7d32',
      registered: '#1976d2'
    };
    
    return statusColors[status.toLowerCase()] || '#757575';
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 FCFA';
    return `${amount.toLocaleString()} FCFA`;
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (!item) {
    return null;
  }

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {item.images && item.images.length > 0 ? (
          <ImageGallery images={item.images} />
        ) : (
          <CardMedia
            component="img"
            height="200"
            image={item.image || '/placeholder-image.jpg'}
            alt={item.name || 'Item image'}
            sx={{ objectFit: 'cover' }}
          />
        )}
        {item.status && (
          <Chip
            label={item.status.toUpperCase()}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: getStatusColor(item.status),
              color: 'white',
              fontWeight: 'bold',
              boxShadow: 2,
              zIndex: 1
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {item.name || 'Sans nom'}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {item.description || 'Aucune description'}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Valeur estimée
          </Typography>
          <Typography variant="h6" color="primary.main" gutterBottom>
            {formatCurrency(item.purchasePrice)}
          </Typography>
        </Box>

        {item.category && (
          <Chip
            label={item.category}
            size="small"
            sx={{ mt: 1 }}
            color="primary"
            variant="outlined"
          />
        )}

        {(showLocation || showContact || showDate) && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 2 }} />
            
            {showLocation && item.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOnIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {item.location}
                </Typography>
              </Box>
            )}

            {showDate && item.date && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarTodayIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(item.date)}
                </Typography>
              </Box>
            )}

            {showContact && (
              <>
                {item.owner && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PersonIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {item.owner}
                    </Typography>
                  </Box>
                )}
                {item.contact && (
                  <Button
                    startIcon={<PhoneIcon />}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    href={`tel:${item.contact}`}
                  >
                    Contacter
                  </Button>
                )}
              </>
            )}
          </Box>
        )}
      </CardContent>
      
      {onStatusChange && (
        <Box sx={{ px: 2, pb: 2 }}>
          <ItemStatusButtons
            onStatusChange={onStatusChange}
            currentStatus={item.status || ''}
          />
        </Box>
      )}
    </Card>
  );
};

export default ItemCard;

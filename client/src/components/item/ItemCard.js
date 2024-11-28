import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import StatusButtons from '../common/StatusButtons';
import { formatDate } from '../../utils/dateUtils';
import { getStatusColor } from '../../theme/statusTheme';

const ItemCard = ({ item, onEdit, onDelete, onStatusChange }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {item.images && item.images.length > 0 && (
        <CardMedia
          component="img"
          height="200"
          image={item.images[0]}
          alt={item.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div">
            {item.name}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => onEdit(item)} sx={{ mr: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(item.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography color="text.secondary" paragraph>
          {item.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={item.status.toUpperCase()}
            sx={{
              bgcolor: getStatusColor(item.status),
              color: 'white',
              mr: 1,
            }}
          />
          <Chip
            label={item.category}
            variant="outlined"
            sx={{ mr: 1 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Catégorie:</strong> {item.category}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Marque:</strong> {item.brand}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Modèle:</strong> {item.model}
          </Typography>
          {item.serialNumber && (
            <Typography variant="body2" gutterBottom>
              <strong>N° de série:</strong> {item.serialNumber}
            </Typography>
          )}
          <Typography variant="body2" gutterBottom>
            <strong>État:</strong> {item.condition}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Date d'achat:</strong> {formatDate(item.purchaseDate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Prix d'achat:</strong> {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: item.currency || 'XOF',
              maximumFractionDigits: 0
            }).format(item.purchasePrice)}
          </Typography>
        </Box>

        <StatusButtons
          itemId={item.id}
          currentStatus={item.status}
          onStatusChange={onStatusChange}
        />
      </CardContent>
    </Card>
  );
};

export default ItemCard;

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const MyAnnouncements = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Données de test
  const announcements = [
    {
      id: 1,
      title: 'Portefeuille marron',
      type: 'Perdu',
      date: '2024-01-10',
      status: 'active',
      location: 'Paris 9e',
      description: 'Portefeuille en cuir marron contenant des papiers importants',
    },
    {
      id: 2,
      title: 'Montre connectée',
      type: 'Trouvé',
      date: '2024-01-12',
      status: 'resolved',
      location: 'Paris 11e',
      description: 'Apple Watch trouvée près de la station Bastille',
    },
    {
      id: 3,
      title: 'Vélo électrique',
      type: 'Volé',
      date: '2024-01-15',
      status: 'active',
      location: 'Paris 13e',
      description: 'Vélo électrique noir de marque VanMoof',
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuClick = (event, announcement) => {
    setAnchorEl(event.currentTarget);
    setSelectedAnnouncement(announcement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAnnouncement(null);
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'Trouvé':
        return '#4caf50';
      case 'Perdu':
        return '#f44336';
      case 'Volé':
        return '#ff9800';
      default:
        return theme.palette.primary.main;
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (value === 0) return announcement.status === 'active';
    if (value === 1) return announcement.status === 'resolved';
    return true;
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Mes Annonces
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 3,
            },
          }}
        >
          <Tab label="En cours" />
          <Tab label="Résolues" />
        </Tabs>
      </Box>

      <Grid container spacing={2}>
        {filteredAnnouncements.map((announcement) => (
          <Grid item xs={12} key={announcement.id}>
            <Card
              sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6">
                      {announcement.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={announcement.type}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(announcement.type),
                          color: 'white',
                        }}
                      />
                      <Chip
                        label={announcement.location}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={new Date(announcement.date).toLocaleDateString('fr-FR')}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, announcement)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {announcement.description}
                </Typography>
              </CardContent>
              {announcement.status === 'active' && (
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    sx={{ color: '#4caf50' }}
                  >
                    Marquer comme résolu
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Modifier
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {filteredAnnouncements.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Aucune annonce {value === 0 ? 'en cours' : 'résolue'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MyAnnouncements;

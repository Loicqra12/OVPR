import React from 'react';
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';

const RecommendedAnnouncements = () => {
  const theme = useTheme();

  // Données de test
  const announcements = [
    {
      id: 1,
      title: 'iPhone 13 Pro',
      type: 'Trouvé',
      category: 'Électronique',
      location: 'Paris 15e',
      date: '2024-01-15',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Clés de voiture',
      type: 'Perdu',
      category: 'Clés',
      location: 'Paris 8e',
      date: '2024-01-14',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Sac à main noir',
      type: 'Perdu',
      category: 'Accessoires',
      location: 'Paris 16e',
      date: '2024-01-13',
      image: 'https://via.placeholder.com/150',
    },
  ];

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

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Annonces Recommandées
      </Typography>

      <Grid container spacing={2}>
        {announcements.map((announcement) => (
          <Grid item xs={12} key={announcement.id}>
            <Card
              sx={{
                display: 'flex',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: 'cover' }}
                image={announcement.image}
                alt={announcement.title}
              />
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" component="div">
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
                        label={announcement.category}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <BookmarkIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {announcement.location}
                  </Typography>
                  <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {new Date(announcement.date).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default RecommendedAnnouncements;

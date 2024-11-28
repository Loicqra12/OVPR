import React from 'react';
import {
  List,
  ListItem,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { formatDate } from '../../utils/dateUtils';
import { getStatusColor } from '../../theme/statusTheme';

const AnnouncementsList = () => {
  const {
    announcements,
    loading,
    error,
    deleteAnnouncement,
  } = useAnnouncements();

  if (loading) {
    return <Typography>Chargement des annonces...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!announcements.length) {
    return <Typography>Aucune annonce trouvée</Typography>;
  }

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  return (
    <List>
      {announcements.map((announcement) => (
        <ListItem key={announcement.id}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" component="div">
                    {announcement.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {announcement.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={announcement.status}
                      sx={{
                        backgroundColor: getStatusColor(announcement.status),
                        color: 'white',
                        mr: 1,
                      }}
                    />
                    <Chip
                      label={announcement.category}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={announcement.location}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Typography color="text.secondary" sx={{ mr: 2 }}>
                      {formatDate(announcement.date)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {/* TODO: Implement edit */}}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default AnnouncementsList;

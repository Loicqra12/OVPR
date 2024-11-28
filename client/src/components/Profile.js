import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informations personnelles
            </Typography>
            <Typography>Membre depuis: {new Date(user.createdAt).toLocaleDateString()}</Typography>
            <Typography>Statut: {user.status || 'Actif'}</Typography>
            <Typography>Rôle: {user.role || 'Utilisateur'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Statistiques
            </Typography>
            <Typography>Objets déclarés: {user.itemsDeclared || 0}</Typography>
            <Typography>Objets trouvés: {user.stats?.itemsFound || 0}</Typography>
            <Typography>Objets retournés: {user.stats?.itemsReturned || 0}</Typography>
            <Typography>Note moyenne: {user.stats?.rating || 0}/5</Typography>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/settings')}
          >
            Modifier le profil
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;

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
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  FindInPage as FindIcon,
  AssignmentReturn as ReturnIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const { t } = useTranslation();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = () => {
    navigate('/settings');
  };

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
              {user.firstName} {user.lastName}
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
              Informations de contact
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user.email}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Téléphone"
                  secondary={user.phone || 'Non renseigné'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Adresse"
                  secondary={user.address || 'Non renseignée'}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Statistiques
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <FindIcon color="primary" />
                <Typography>
                  Objets trouvés : {user.stats?.itemsFound || 0}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <ReturnIcon color="success" />
                <Typography>
                  Objets retournés : {user.stats?.itemsReturned || 0}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <StarIcon color="warning" />
                <Typography>
                  Note moyenne : {user.stats?.rating || 0}/5
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdit}
          >
            {t('Edit Profile')}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
          >
            {t('Logout')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;

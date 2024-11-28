import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Badge,
  useTheme,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import UserHeader from './UserHeader';
import UserProfile from './UserProfile';
import QuickActions from './QuickActions';
import RecommendedAnnouncements from './RecommendedAnnouncements';
import MyAnnouncements from './MyAnnouncements';
import InteractiveMap from './InteractiveMap';
import UserSettings from './UserSettings';

const UserDashboard = () => {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState([]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <UserHeader 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        notificationCount={notifications.length}
      />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Section Profil */}
          {activeSection === 'profile' && (
            <Grid item xs={12} md={4}>
              <UserProfile />
            </Grid>
          )}

          {/* Section Actions Rapides */}
          <Grid item xs={12} md={activeSection === 'profile' ? 8 : 12}>
            <QuickActions />
          </Grid>

          {/* Section Annonces Recommandées */}
          <Grid item xs={12} md={6}>
            <RecommendedAnnouncements />
          </Grid>

          {/* Section Mes Annonces */}
          <Grid item xs={12} md={6}>
            <MyAnnouncements />
          </Grid>

          {/* Carte Interactive */}
          <Grid item xs={12}>
            <InteractiveMap />
          </Grid>

          {/* Section Paramètres */}
          {activeSection === 'settings' && (
            <Grid item xs={12}>
              <UserSettings />
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                À propos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                OVPR - La plateforme de déclaration d'objets perdus, volés et retrouvés
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Liens utiles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mentions légales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Conditions d'utilisation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Politique de confidentialité
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: contact@ovpr.fr
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Téléphone: +33 (0)1 23 45 67 89
              </Typography>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Typography variant="body2" color="text.secondary" align="center">
              {'© '}
              {new Date().getFullYear()}
              {' OVPR. Tous droits réservés.'}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default UserDashboard;

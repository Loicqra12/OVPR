import React from 'react';
import { useThemeMode } from '../contexts/ThemeContext';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logoovpr.PNG';
import detective from '../assets/detective.png.png';

const Home = () => {
  const { isDarkMode } = useThemeMode();
  const navigate = useNavigate();

  const handleAction = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <img src={logo} alt="Logo OVPR" style={{ height: '100px' }} />
      </Box>
      <Grid container spacing={4}>
        {/* Section Hero */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: isDarkMode ? '#fff' : '#333' }}>
              Retrouvez vos objets perdus
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: isDarkMode ? '#ccc' : '#666' }}>
              La plateforme qui vous aide à retrouver vos biens perdus ou volés
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              >
                Créer un compte
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                component={Link}
                to="/login"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}
              >
                Se connecter
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={detective}
            alt="Detective"
            sx={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
            }}
          />
        </Grid>

        {/* Actions Cards Section */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)' },
                  bgcolor: isDarkMode ? '#1e1e1e' : '#fff'
                }}
                onClick={() => handleAction('/declare-lost')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AddIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h6" component="h2">
                      Déclarer un objet perdu
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Signalez rapidement la perte de votre objet pour maximiser les chances de le retrouver
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)' },
                  bgcolor: isDarkMode ? '#1e1e1e' : '#fff'
                }}
                onClick={() => handleAction('/declare-found')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SearchIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h6" component="h2">
                      Déclarer un objet trouvé
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Aidez les autres à retrouver leurs biens en signalant un objet trouvé
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)' },
                  bgcolor: isDarkMode ? '#1e1e1e' : '#fff'
                }}
                onClick={() => handleAction('/announcements')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h6" component="h2">
                      Consulter les annonces
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Parcourez les dernières annonces d'objets perdus et trouvés
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Statistiques et informations supplémentaires */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              mt: 4,
              bgcolor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
              borderRadius: 2
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    1000+
                  </Typography>
                  <Typography variant="body1">
                    Objets retrouvés
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    5000+
                  </Typography>
                  <Typography variant="body1">
                    Utilisateurs actifs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    24/7
                  </Typography>
                  <Typography variant="body1">
                    Support disponible
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;

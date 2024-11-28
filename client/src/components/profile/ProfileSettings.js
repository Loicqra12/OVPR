import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Switch,
  FormControlLabel,
  Slider,
  Box,
  Divider,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  MyLocation as MyLocationIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    avatar: null,
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      searchRadius: 10,
    }
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données du profil
    const mockProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+225 0123456789',
      location: 'Abidjan, Cocody',
      avatar: null,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        searchRadius: 10,
      }
    };
    setProfile(mockProfile);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (name) => (event) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
      }
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Ici, vous pourriez faire un appel API pour obtenir l'adresse à partir des coordonnées
          setProfile(prev => ({
            ...prev,
            location: `${position.coords.latitude}, ${position.coords.longitude}`
          }));
          setLoading(false);
        },
        (error) => {
          setNotification({
            open: true,
            message: "Erreur de géolocalisation",
            severity: 'error'
          });
          setLoading(false);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotification({
        open: true,
        message: "Profil mis à jour avec succès",
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Erreur lors de la mise à jour du profil",
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Paramètres du Profil
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Avatar Section */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box position="relative">
                <Avatar
                  src={profile.avatar}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <label htmlFor="avatar-input">
                  <Input
                    accept="image/*"
                    id="avatar-input"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <IconButton
                    color="primary"
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </Box>
            </Grid>

            {/* Informations Personnelles */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations Personnelles
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  label="Localisation"
                  name="location"
                  value={profile.location}
                  onChange={handleInputChange}
                />
                <IconButton
                  color="primary"
                  onClick={handleGeolocation}
                  disabled={loading}
                >
                  <MyLocationIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Préférences */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Préférences
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.preferences.emailNotifications}
                    onChange={handlePreferenceChange('emailNotifications')}
                  />
                }
                label="Notifications par email"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.preferences.smsNotifications}
                    onChange={handlePreferenceChange('smsNotifications')}
                  />
                }
                label="Notifications par SMS"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>
                Rayon de recherche : {profile.preferences.searchRadius} km
              </Typography>
              <Slider
                value={profile.preferences.searchRadius}
                onChange={handlePreferenceChange('searchRadius')}
                min={1}
                max={50}
                valueLabelDisplay="auto"
                marks={[
                  { value: 1, label: '1 km' },
                  { value: 10, label: '10 km' },
                  { value: 25, label: '25 km' },
                  { value: 50, label: '50 km' },
                ]}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                Enregistrer les modifications
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileSettings;

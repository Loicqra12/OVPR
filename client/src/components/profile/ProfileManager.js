import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
  Switch,
  FormControlLabel,
  Slider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera,
  MyLocation,
  LocationOn,
  Save,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ProfileManager = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    profilePicture: user?.profilePicture || null,
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      searchRadius: 10, // en km
    },
  });

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Simuler le chargement d'une image
        setLoading(true);
        // TODO: Implémenter le chargement réel de l'image
        const imageUrl = URL.createObjectURL(file);
        setProfileData(prev => ({
          ...prev,
          profilePicture: imageUrl
        }));
      } catch (err) {
        setError('Erreur lors du chargement de l\'image');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setProfileData(prev => ({
            ...prev,
            location: `${latitude},${longitude}`
          }));
        },
        (error) => {
          setError('Erreur de géolocalisation');
        }
      );
    } else {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
    }
  };

  const handlePreferenceChange = (name) => (event) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: event.target.checked
      }
    }));
  };

  const handleRadiusChange = (event, newValue) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        searchRadius: newValue
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // TODO: Implémenter la mise à jour réelle du profil
      await updateUser(profileData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Gérer mon profil
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profil mis à jour avec succès !
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Photo de profil */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box position="relative">
                <Avatar
                  src={profileData.profilePicture}
                  sx={{ width: 120, height: 120 }}
                />
                <input
                  accept="image/*"
                  type="file"
                  id="profile-picture"
                  hidden
                  onChange={handleProfilePictureChange}
                />
                <label htmlFor="profile-picture">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Grid>

            {/* Informations personnelles */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Téléphone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>

            {/* Localisation */}
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Localisation"
                  value={profileData.location}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleLocationDetection}>
                        <MyLocation />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </Grid>

            {/* Préférences */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Préférences
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.emailNotifications}
                    onChange={handlePreferenceChange('emailNotifications')}
                  />
                }
                label="Notifications par email"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.smsNotifications}
                    onChange={handlePreferenceChange('smsNotifications')}
                  />
                }
                label="Notifications par SMS"
              />
            </Grid>

            {/* Rayon de recherche */}
            <Grid item xs={12}>
              <Typography gutterBottom>
                Rayon de recherche : {profileData.preferences.searchRadius} km
              </Typography>
              <Slider
                value={profileData.preferences.searchRadius}
                onChange={handleRadiusChange}
                min={1}
                max={50}
                marks={[
                  { value: 1, label: '1 km' },
                  { value: 10, label: '10 km' },
                  { value: 25, label: '25 km' },
                  { value: 50, label: '50 km' },
                ]}
              />
            </Grid>

            {/* Bouton de sauvegarde */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={loading}
                fullWidth
              >
                Sauvegarder les modifications
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProfileManager;

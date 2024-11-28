import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    contactEmail: '',
    supportPhone: '',
    enableRegistration: true,
    enableNotifications: true,
    moderationRequired: false,
    maxImagesPerAnnounce: 5,
    announceDuration: 30,
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      setError('Erreur lors du chargement des paramètres');
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: event.target.type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des paramètres');
      }

      setSuccess(true);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Paramètres
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Paramètres généraux */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Paramètres généraux
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Nom du site"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Email de contact"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Téléphone du support"
                  name="supportPhone"
                  value={settings.supportPhone}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
            </Paper>
          </Grid>

          {/* Paramètres des annonces */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Paramètres des annonces
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Nombre maximum d'images par annonce"
                  name="maxImagesPerAnnounce"
                  type="number"
                  value={settings.maxImagesPerAnnounce}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Durée des annonces (jours)"
                  name="announceDuration"
                  type="number"
                  value={settings.announceDuration}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
            </Paper>
          </Grid>

          {/* Options système */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Options système
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Inscription des utilisateurs"
                    secondary="Autoriser les nouveaux utilisateurs à s'inscrire"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.enableRegistration}
                          onChange={handleChange}
                          name="enableRegistration"
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Notifications"
                    secondary="Activer les notifications par email"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.enableNotifications}
                          onChange={handleChange}
                          name="enableNotifications"
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Modération"
                    secondary="Modérer les annonces avant publication"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.moderationRequired}
                          onChange={handleChange}
                          name="moderationRequired"
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Mode maintenance"
                    secondary="Activer le mode maintenance"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.maintenanceMode}
                          onChange={handleChange}
                          name="maintenanceMode"
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Messages d'erreur et de succès */}
          <Grid item xs={12}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Les paramètres ont été mis à jour avec succès.
              </Alert>
            )}
          </Grid>

          {/* Bouton de sauvegarde */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Settings;

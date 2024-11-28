import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Slider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  LocationOn,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const GeoAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    keywords: '',
    radius: 10,
    categories: [],
    notifyBy: {
      email: true,
      push: true,
      sms: false,
    },
  });

  // Simuler le chargement des alertes
  useEffect(() => {
    // TODO: Remplacer par un appel API réel
    const mockAlerts = [
      {
        id: 1,
        keywords: 'iPhone, Apple',
        radius: 5,
        categories: ['Électronique'],
        location: { lat: 48.8566, lng: 2.3522, address: 'Paris, France' },
        notifyBy: { email: true, push: true, sms: false },
      },
      {
        id: 2,
        keywords: 'sac, portefeuille',
        radius: 10,
        categories: ['Accessoires'],
        location: { lat: 45.7640, lng: 4.8357, address: 'Lyon, France' },
        notifyBy: { email: true, push: false, sms: true },
      },
    ];
    setAlerts(mockAlerts);
  }, []);

  const handleAlertToggle = () => {
    setIsEnabled(!isEnabled);
    // TODO: Mettre à jour la préférence utilisateur via l'API
  };

  const handleAddAlert = () => {
    setCurrentAlert(null);
    setFormData({
      keywords: '',
      radius: 10,
      categories: [],
      notifyBy: {
        email: true,
        push: true,
        sms: false,
      },
    });
    setDialogOpen(true);
  };

  const handleEditAlert = (alert) => {
    setCurrentAlert(alert);
    setFormData({
      keywords: alert.keywords,
      radius: alert.radius,
      categories: alert.categories,
      notifyBy: alert.notifyBy,
    });
    setDialogOpen(true);
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    // TODO: Supprimer l'alerte via l'API
  };

  const handleSaveAlert = () => {
    if (!formData.keywords.trim()) {
      setError('Veuillez entrer au moins un mot-clé');
      return;
    }

    if (currentAlert) {
      // Modification d'une alerte existante
      setAlerts(alerts.map(alert =>
        alert.id === currentAlert.id
          ? { ...alert, ...formData }
          : alert
      ));
    } else {
      // Création d'une nouvelle alerte
      const newAlert = {
        id: Date.now(),
        ...formData,
        location: { lat: 48.8566, lng: 2.3522, address: 'Paris, France' }, // À remplacer par la localisation réelle
      };
      setAlerts([...alerts, newAlert]);
    }

    setDialogOpen(false);
    setError('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2">
              Alertes géolocalisées
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isEnabled}
                  onChange={handleAlertToggle}
                  color="primary"
                />
              }
              label="Activer les alertes"
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAlert}
            sx={{ mb: 3 }}
            disabled={!isEnabled}
          >
            Nouvelle alerte
          </Button>

          <List>
            {alerts.map((alert) => (
              <ListItem
                key={alert.id}
                sx={{
                  mb: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOn color="primary" />
                      <Typography variant="subtitle1">
                        {alert.location.address}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        Mots-clés : {alert.keywords}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rayon : {alert.radius} km
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        {alert.categories.map((category) => (
                          <Chip
                            key={category}
                            label={category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditAlert(alert)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentAlert ? 'Modifier l\'alerte' : 'Nouvelle alerte'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Mots-clés (séparés par des virgules)"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              margin="normal"
            />
            <Typography gutterBottom sx={{ mt: 2 }}>
              Rayon de recherche : {formData.radius} km
            </Typography>
            <Slider
              value={formData.radius}
              onChange={(e, value) => setFormData({ ...formData, radius: value })}
              min={1}
              max={50}
              marks={[
                { value: 1, label: '1km' },
                { value: 10, label: '10km' },
                { value: 25, label: '25km' },
                { value: 50, label: '50km' },
              ]}
            />
            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>
                Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifyBy.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifyBy: { ...formData.notifyBy, email: e.target.checked }
                    })}
                  />
                }
                label="Email"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifyBy.push}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifyBy: { ...formData.notifyBy, push: e.target.checked }
                    })}
                  />
                }
                label="Notifications push"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifyBy.sms}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifyBy: { ...formData.notifyBy, sms: e.target.checked }
                    })}
                  />
                }
                label="SMS"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveAlert} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GeoAlerts;

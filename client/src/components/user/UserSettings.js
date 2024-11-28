import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  ColorLens as ColorLensIcon,
} from '@mui/icons-material';

const UserSettings = () => {
  const theme = useTheme();
  const [openPassword, setOpenPassword] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    language: 'fr',
    theme: 'light',
    profileVisibility: 'public',
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePasswordSubmit = () => {
    // Logique de changement de mot de passe
    setOpenPassword(false);
  };

  const handleDeleteAccount = () => {
    // Logique de suppression de compte
    setOpenDelete(false);
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
        Paramètres
      </Typography>

      {/* Notifications */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.primary.main }}>
          <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Notifications
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Notifications par email"
              secondary="Recevoir des alertes par email"
            />
            <Switch
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              color="primary"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Notifications push"
              secondary="Recevoir des notifications sur le navigateur"
            />
            <Switch
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              color="primary"
            />
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Langue et Apparence */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.primary.main }}>
          <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Langue et Apparence
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Langue</InputLabel>
            <Select
              value={settings.language}
              label="Langue"
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Thème</InputLabel>
            <Select
              value={settings.theme}
              label="Thème"
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <MenuItem value="light">Clair</MenuItem>
              <MenuItem value="dark">Sombre</MenuItem>
              <MenuItem value="system">Système</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Confidentialité */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.primary.main }}>
          <VisibilityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Confidentialité
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Visibilité du profil</InputLabel>
          <Select
            value={settings.profileVisibility}
            label="Visibilité du profil"
            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Privé</MenuItem>
            <MenuItem value="contacts">Contacts uniquement</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sécurité */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.primary.main }}>
          <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Sécurité
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setOpenPassword(true)}
          sx={{ mt: 2 }}
        >
          Changer le mot de passe
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Danger Zone */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Zone de danger
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpenDelete(true)}
          sx={{ mt: 2 }}
        >
          Supprimer mon compte
        </Button>
      </Box>

      {/* Dialog Changement de mot de passe */}
      <Dialog open={openPassword} onClose={() => setOpenPassword(false)}>
        <DialogTitle>Changer le mot de passe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mot de passe actuel"
            type="password"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Confirmer le nouveau mot de passe"
            type="password"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPassword(false)}>Annuler</Button>
          <Button onClick={handlePasswordSubmit} variant="contained">Confirmer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Suppression de compte */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Supprimer mon compte</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
          </Alert>
          <TextField
            autoFocus
            margin="dense"
            label="Entrez votre mot de passe pour confirmer"
            type="password"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Annuler</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserSettings;

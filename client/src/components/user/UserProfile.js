import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';

const UserProfile = () => {
  const theme = useTheme();
  const [openEdit, setOpenEdit] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    whatsapp: '+33 6 12 34 56 78',
    location: 'Paris, France',
  });

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleSave = () => {
    // Logique de sauvegarde
    handleEditClose();
  };

  return (
    <>
      <Paper 
        elevation={3}
        sx={{
          p: 3,
          background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
        }}
      >
        {/* En-tête du profil */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.primary.main,
              fontSize: '2rem',
            }}
          >
            {userData.firstName[0]}{userData.lastName[0]}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5" component="h2">
              {userData.firstName} {userData.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Membre depuis {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Informations de contact */}
        <List>
          <ListItem>
            <ListItemIcon>
              <EmailIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={userData.email}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Téléphone"
              secondary={userData.phone}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WhatsAppIcon sx={{ color: '#25D366' }} />
            </ListItemIcon>
            <ListItemText
              primary="WhatsApp"
              secondary={userData.whatsapp}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Localisation"
              secondary={userData.location}
            />
          </ListItem>
        </List>

        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditOpen}
          sx={{
            mt: 2,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
            },
          }}
        >
          Modifier le profil
        </Button>
      </Paper>

      {/* Dialog de modification */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Modifier mon profil</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={userData.firstName}
                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                value={userData.lastName}
                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Téléphone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="WhatsApp"
                value={userData.whatsapp}
                onChange={(e) => setUserData({ ...userData, whatsapp: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Localisation"
                value={userData.location}
                onChange={(e) => setUserData({ ...userData, location: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Annuler</Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
              },
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;

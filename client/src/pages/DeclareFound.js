import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DeclareFound = () => {
  const navigate = useNavigate();
  const [foundItem, setFoundItem] = useState({
    itemType: '',
    description: '',
    location: '',
    foundDate: '',
    contactPreference: '',
    isAnonymous: false,
    additionalNotes: ''
  });

  const itemTypes = [
    'Électronique',
    'Documents',
    'Accessoires',
    'Bijoux',
    'Vêtements',
    'Autres'
  ];

  const contactPreferences = [
    'Email',
    'Téléphone',
    'Message dans l\'application'
  ];

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFoundItem({
      ...foundItem,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implémenter la soumission à l'API
    console.log('Objet trouvé à déclarer:', foundItem);
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Déclarer un Bien Retrouvé
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Aidez à retrouver le propriétaire d'un objet que vous avez trouvé
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Type d'objet"
                name="itemType"
                value={foundItem.itemType}
                onChange={handleChange}
              >
                {itemTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Date de découverte"
                name="foundDate"
                type="date"
                value={foundItem.foundDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Description détaillée"
                name="description"
                value={foundItem.description}
                onChange={handleChange}
                helperText="Décrivez l'objet avec le plus de détails possible"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Lieu de découverte"
                name="location"
                value={foundItem.location}
                onChange={handleChange}
                helperText="Précisez l'endroit où vous avez trouvé l'objet"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Préférence de contact"
                name="contactPreference"
                value={foundItem.contactPreference}
                onChange={handleChange}
              >
                {contactPreferences.map((preference) => (
                  <MenuItem key={preference} value={preference}>
                    {preference}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isAnonymous"
                    checked={foundItem.isAnonymous}
                    onChange={handleChange}
                  />
                }
                label="Je souhaite rester anonyme"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes additionnelles"
                name="additionalNotes"
                value={foundItem.additionalNotes}
                onChange={handleChange}
                helperText="Informations supplémentaires qui pourraient être utiles"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Soumettre la déclaration
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default DeclareFound;

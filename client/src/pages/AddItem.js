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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

const AddItem = () => {
  const navigate = useNavigate();
  const [item, setItem] = useState({
    name: '',
    description: '',
    category: '',
    value: '',
    currency: 'FCFA',
    purchaseDate: '',
    identifierType: '',
    identifierNumber: '',
    brand: '',
    photos: []
  });

  const [previewUrls, setPreviewUrls] = useState([]);

  const categories = [
    'Smartphones',
    'Ordinateurs',
    'Tablettes',
    'Montres Connectées',
    'Caméras',
    'Consoles de Jeux',
    'Accessoires Audio',
    'Imprimantes',
    'Écrans',
    'Drones',
    'GPS',
    'Cyclomoteurs',
    'Autres Appareils'
  ];

  const currencies = [
    // Devises Africaines
    { value: 'FCFA', label: 'FCFA (Franc CFA)' },
    { value: 'XOF', label: 'XOF (Franc CFA BCEAO)' },
    { value: 'XAF', label: 'XAF (Franc CFA BEAC)' },
    { value: 'NGN', label: 'NGN (Naira Nigérian)' },
    { value: 'ZAR', label: 'ZAR (Rand Sud-africain)' },
    { value: 'GHS', label: 'GHS (Cedi Ghanéen)' },
    { value: 'KES', label: 'KES (Shilling Kényan)' },
    { value: 'MAD', label: 'MAD (Dirham Marocain)' },
    { value: 'EGP', label: 'EGP (Livre Égyptienne)' },

    // Devises Internationales Majeures
    { value: 'EUR', label: 'EUR (Euro)' },
    { value: 'USD', label: 'USD (Dollar Américain)' },
    { value: 'GBP', label: 'GBP (Livre Sterling)' },
    { value: 'JPY', label: 'JPY (Yen Japonais)' },
    { value: 'CHF', label: 'CHF (Franc Suisse)' },
    { value: 'CAD', label: 'CAD (Dollar Canadien)' },
    { value: 'AUD', label: 'AUD (Dollar Australien)' },
    { value: 'CNY', label: 'CNY (Yuan Chinois)' },
    { value: 'INR', label: 'INR (Roupie Indienne)' },
    { value: 'BRL', label: 'BRL (Real Brésilien)' },
    { value: 'RUB', label: 'RUB (Rouble Russe)' },
    { value: 'AED', label: 'AED (Dirham des Émirats)' }
  ];

  const identifierTypes = [
    { value: '', label: 'Sélectionner un type' },
    { value: 'imei', label: 'Numéro IMEI (Téléphones)' },
    { value: 'serial', label: 'Numéro de Série' },
    { value: 'vin', label: 'Numéro de Chassis (VIN)' }
  ];

  const handleChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newPhotos = [...item.photos, ...files];
      setItem({ ...item, photos: newPhotos });

      // Créer les URLs de prévisualisation
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = item.photos.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setItem({ ...item, photos: newPhotos });
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implémenter la soumission à l'API
    console.log('Item à enregistrer:', item);
    navigate('/dashboard');
  };

  const getIdentifierLabel = () => {
    switch (item.category.toLowerCase()) {
      case 'smartphones':
        return 'Numéro IMEI';
      case 'cyclomoteurs':
        return 'Numéro de Chassis (VIN)';
      default:
        return 'Numéro de Série';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Enregistrer un Bien
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Enregistrez vos objets de valeur pour une meilleure protection
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nom de l'objet"
                name="name"
                value={item.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={item.description}
                onChange={handleChange}
                helperText="Décrivez votre objet (marques distinctives, état, etc.)"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Catégorie"
                name="category"
                value={item.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Valeur estimée"
                name="value"
                type="number"
                value={item.value}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label="Devise"
                name="currency"
                value={item.currency}
                onChange={handleChange}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date d'achat"
                name="purchaseDate"
                type="date"
                value={item.purchaseDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marque"
                name="brand"
                value={item.brand}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type d'identifiant</InputLabel>
                <Select
                  name="identifierType"
                  value={item.identifierType}
                  onChange={handleChange}
                  label="Type d'identifiant"
                >
                  {identifierTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={getIdentifierLabel()}
                name="identifierNumber"
                value={item.identifierNumber}
                onChange={handleChange}
                helperText="Numéro unique d'identification"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  multiple
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                  >
                    Ajouter des photos
                  </Button>
                </label>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {previewUrls.map((url, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100
                    }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: 'background.paper'
                      }}
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
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
                  Enregistrer
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddItem;

import React from 'react';
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fr } from 'date-fns/locale';

const CommonFields = ({ formData, handleChange, handleDateChange }) => {
  const categories = [
    {
      id: 'vehicle',
      label: 'Véhicule',
      subcategories: [
        { id: 'voiture', label: 'Voiture', requiresVin: true },
        { id: 'moto', label: 'Moto', requiresVin: true },
        { id: 'scooter', label: 'Scooter', requiresVin: true },
        { id: 'cyclomoteur', label: 'Cyclomoteur', requiresVin: true },
        { id: 'velo', label: 'Vélo', requiresVin: false },
        { id: 'trottinette', label: 'Trottinette', requiresVin: false },
        { id: 'tricycle', label: 'Tricycle', requiresVin: false },
        { id: 'quad', label: 'Quad', requiresVin: true },
        { id: 'autre_vehicule', label: 'Autre véhicule', requiresVin: false }
      ]
    },
    {
      id: 'animal',
      label: 'Animal',
      subcategories: [
        { id: 'chien', label: 'Chien' },
        { id: 'chat', label: 'Chat' },
        { id: 'oiseau', label: 'Oiseau' },
        { id: 'rongeur', label: 'Rongeur' },
        { id: 'reptile', label: 'Reptile' },
        { id: 'poisson', label: 'Poisson' },
        { id: 'nac', label: 'NAC (Nouveaux Animaux de Compagnie)' },
        { id: 'cheval', label: 'Cheval' },
        { id: 'betail', label: 'Bétail' },
        { id: 'autre_animal', label: 'Autre animal' }
      ]
    },
    {
      id: 'document',
      label: 'Document',
      subcategories: [
        { id: 'carte_identite', label: 'Carte d\'identité' },
        { id: 'passeport', label: 'Passeport' },
        { id: 'permis_conduire', label: 'Permis de conduire' },
        { id: 'carte_vitale', label: 'Carte vitale' },
        { id: 'carte_bancaire', label: 'Carte bancaire' },
        { id: 'titre_sejour', label: 'Titre de séjour' },
        { id: 'carte_grise', label: 'Carte grise' },
        { id: 'autre_document', label: 'Autre document' }
      ]
    },
    {
      id: 'electronique',
      label: 'Électronique',
      subcategories: [
        { id: 'telephone', label: 'Téléphone' },
        { id: 'ordinateur', label: 'Ordinateur' },
        { id: 'tablette', label: 'Tablette' },
        { id: 'console_jeu', label: 'Console de jeux' },
        { id: 'appareil_photo', label: 'Appareil photo' },
        { id: 'autre_electronique', label: 'Autre appareil électronique' }
      ]
    },
    {
      id: 'accessoire',
      label: 'Accessoire',
      subcategories: [
        { id: 'bijou', label: 'Bijou' },
        { id: 'montre', label: 'Montre' },
        { id: 'lunettes', label: 'Lunettes' },
        { id: 'sac', label: 'Sac' },
        { id: 'portefeuille', label: 'Portefeuille' },
        { id: 'cle', label: 'Clé' },
        { id: 'parapluie', label: 'Parapluie' },
        { id: 'autre_accessoire', label: 'Autre accessoire' }
      ]
    },
    {
      id: 'vetement',
      label: 'Vêtement',
      subcategories: [
        { id: 'manteau', label: 'Manteau' },
        { id: 'veste', label: 'Veste' },
        { id: 'pantalon', label: 'Pantalon' },
        { id: 'chaussures', label: 'Chaussures' },
        { id: 'autre_vetement', label: 'Autre vêtement' }
      ]
    },
    {
      id: 'autre',
      label: 'Autre',
      subcategories: [
        { id: 'livre', label: 'Livre' },
        { id: 'instrument_musique', label: 'Instrument de musique' },
        { id: 'materiel_sport', label: 'Matériel de sport' },
        { id: 'jouet', label: 'Jouet' },
        { id: 'autre_objet', label: 'Autre objet' }
      ]
    }
  ];

  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const selectedSubcategory = selectedCategory?.subcategories.find(
    sub => sub.id === formData.subcategory
  );

  const requiresVin = selectedSubcategory?.requiresVin;

  const validateVin = (vin) => {
    if (!vin) return true;
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinRegex.test(vin);
  };

  const vinError = formData.vin && !validateVin(formData.vin);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informations générales
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Catégorie</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Catégorie"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Sous-catégorie</InputLabel>
          <Select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            label="Sous-catégorie"
          >
            {selectedCategory?.subcategories.map((subcat) => (
              <MenuItem key={subcat.id} value={subcat.id}>
                {subcat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          name="title"
          label="Titre de l'annonce"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          name="description"
          label="Description détaillée"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(newValue) => handleDateChange(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth required />}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name="location"
          label="Lieu"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </Grid>

      {formData.category === 'vehicle' && (
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="brand"
                label="Marque"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="model"
                label="Modèle"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="color"
                label="Couleur"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </Grid>
            {requiresVin && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="vin"
                  label="Numéro de châssis (VIN)"
                  value={formData.vin}
                  onChange={handleChange}
                  required
                  error={vinError}
                  helperText={vinError ? "Le numéro VIN doit contenir exactement 17 caractères alphanumériques" : "Format : 17 caractères (lettres majuscules et chiffres)"}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="registration"
                label="Numéro d'immatriculation"
                value={formData.registration}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {formData.category === 'animal' && (
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="breed"
                label="Race"
                value={formData.breed}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="name"
                label="Nom de l'animal"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="color"
                label="Couleur"
                value={formData.color}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="chip"
                label="Numéro de puce/tatouage"
                value={formData.chip}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="distinguishingFeatures"
                label="Signes distinctifs"
                value={formData.distinguishingFeatures}
                onChange={handleChange}
                multiline
                rows={2}
                helperText="Ex: cicatrices, marques particulières, comportement..."
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid item xs={12}>
        <TextField
          fullWidth
          name="characteristics"
          label="Caractéristiques particulières"
          value={formData.characteristics}
          onChange={handleChange}
          multiline
          rows={2}
        />
      </Grid>
    </Grid>
  );
};

export default CommonFields;

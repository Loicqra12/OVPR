import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    value: 'electronics',
    label: 'Électronique',
    fields: [
      { name: 'serialNumber', label: 'Numéro de série', required: true },
      { name: 'purchaseDate', label: 'Date d\'achat', required: false },
    ]
  },
  {
    value: 'vehicle',
    label: 'Véhicule',
    fields: [
      { name: 'serialNumber', label: 'Numéro de série (VIN)', required: true },
      { name: 'purchaseDate', label: 'Date d\'achat', required: false },
    ]
  },
  {
    value: 'jewelry',
    label: 'Bijoux et objets de valeur',
    fields: [
      { name: 'description', label: 'Description détaillée', required: true },
      { name: 'value', label: 'Valeur estimée', required: false },
    ]
  },
  {
    value: 'document',
    label: 'Documents importants',
    fields: [
      { name: 'description', label: 'Description détaillée', required: true },
      { name: 'value', label: 'Valeur estimée', required: false },
    ]
  }
];

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    serialNumber: '',
    purchaseDate: '',
    description: '',
    value: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Implement item registration logic
    console.log('Form submitted:', formData);
    navigate('/dashboard');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Enregistrer un nouveau bien
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="name"
                  label="Nom du bien"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <Select
                    value={formData.category}
                    onChange={handleChange}
                    name="category"
                    displayEmpty
                    required
                  >
                    <MenuItem value="" disabled>Sélectionner une catégorie</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Sélectionner la catégorie du bien</FormHelperText>
                </FormControl>
              </Grid>

              {formData.category && categories.find(category => category.value === formData.category).fields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name={field.name}
                    label={field.label}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Enregistrer le bien
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/dashboard')}
              >
                Annuler
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddItem;

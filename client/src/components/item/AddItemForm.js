import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
  Card,
  CardMedia,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import StatusSelect from '../common/StatusSelect';
import StatusButtons from '../common/StatusButtons';

const AddItemForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    status: '',
    location: '',
    contact: '',
    condition: '',
    color: '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Créer les URLs de prévisualisation
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    
    // Ajouter les fichiers au formData
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveImage = (index) => {
    // Supprimer l'image de la prévisualisation
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    
    // Supprimer l'image du formData
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Traitement du formulaire
    console.log(formData);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Enregistrer un bien
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Nom du bien"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Catégorie"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </Grid>
          
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          {/* Détails du produit */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marque"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Modèle"
              name="model"
              value={formData.model}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Numéro de série"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date d'achat"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Prix d'achat"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <StatusSelect
              value={formData.status}
              onChange={handleStatusChange}
              required
            />
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Photos du bien
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Ajouter des photos
              </Button>
            </label>
          </Grid>

          {/* Prévisualisation des images */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              {previewImages.map((url, index) => (
                <Card key={index} sx={{ position: 'relative', width: 150 }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={url}
                    alt={`Preview ${index + 1}`}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Delete />
                  </IconButton>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* Boutons de statut */}
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ou déclarer directement comme :
              </Typography>
              <StatusButtons
                currentStatus="registered"
                onStatusChange={(status) => handleStatusChange({ target: { value: status } })}
              />
            </Box>
          </Grid>

          {/* Bouton de soumission */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Enregistrer le bien
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddItemForm;

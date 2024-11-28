import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
  DialogContentText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ItemDashboard = () => {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'other',
    description: '',
    serialNumber: '',
    vehicleDetails: {
      type: 'moto',
      vin: '',
      brand: '',
      model: '',
      year: '',
      color: ''
    },
    purchaseDate: '',
    purchasePrice: '',
    images: [],
    receipt: null
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items/my-items');
      setItems(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des biens');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('vehicleDetails.')) {
      const field = name.split('.')[1];
      setNewItem(prev => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          [field]: value
        }
      }));
    } else {
      setNewItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newItem).forEach(key => {
        if (key === 'vehicleDetails') {
          formData.append(key, JSON.stringify(newItem[key]));
        } else {
          formData.append(key, newItem[key]);
        }
      });
      
      if (selectedFile) {
        formData.append('receipt', selectedFile);
      }

      await axios.post('/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Bien ajouté avec succès');
      setOpenDialog(false);
      fetchItems();
      resetForm();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du bien');
    }
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      type: 'other',
      description: '',
      serialNumber: '',
      vehicleDetails: {
        type: 'moto',
        vin: '',
        brand: '',
        model: '',
        year: '',
        color: ''
      },
      purchaseDate: '',
      purchasePrice: '',
      images: [],
      receipt: null
    });
    setSelectedFile(null);
  };

  const updateStatus = async (itemId, newStatus, location = null) => {
    try {
      const data = {
        status: newStatus,
        location: location || null,
        date: new Date(),
        description: 'Mise à jour du statut'
      };

      if (newStatus === 'stolen') {
        const policeReport = prompt('Veuillez entrer le numéro du rapport de police :');
        if (!policeReport) return;
        data.policeReport = policeReport;
      }

      await axios.patch(`/api/items/${itemId}/status`, data);
      toast.success(`Statut mis à jour : ${newStatus}`);
      fetchItems();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      toast.success('Bien supprimé avec succès');
      setItems(items.filter(item => item._id !== itemId));
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression du bien');
    }
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteItem(selectedItem._id);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const renderVehicleFields = () => (
    newItem.type === 'vehicle' && (
      <>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type de véhicule</InputLabel>
          <Select
            name="vehicleDetails.type"
            value={newItem.vehicleDetails.type}
            onChange={handleInputChange}
          >
            <MenuItem value="moto">Moto</MenuItem>
            <MenuItem value="scooter">Scooter</MenuItem>
            <MenuItem value="velo">Vélo</MenuItem>
            <MenuItem value="trottinette">Trottinette</MenuItem>
            <MenuItem value="other">Autre</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Numéro VIN (17 caractères)"
          name="vehicleDetails.vin"
          value={newItem.vehicleDetails.vin}
          onChange={handleInputChange}
          margin="normal"
          required
          inputProps={{ maxLength: 17, minLength: 17 }}
        />
        <TextField
          fullWidth
          label="Marque"
          name="vehicleDetails.brand"
          value={newItem.vehicleDetails.brand}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Modèle"
          name="vehicleDetails.model"
          value={newItem.vehicleDetails.model}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Année"
          name="vehicleDetails.year"
          type="number"
          value={newItem.vehicleDetails.year}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Couleur"
          name="vehicleDetails.color"
          value={newItem.vehicleDetails.color}
          onChange={handleInputChange}
          margin="normal"
          required
        />
      </>
    )
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Mes Biens</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Ajouter un bien
        </Button>
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              {item.images[0] && (
                <CardMedia
                  component="img"
                  height="140"
                  image={item.images[0]}
                  alt={item.name}
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {item.name}
                    {item.type === 'vehicle' && (
                      <TwoWheelerIcon sx={{ ml: 1, verticalAlign: 'middle' }} />
                    )}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {item.receipt && (
                      <IconButton
                        size="small"
                        onClick={() => window.open(item.receipt, '_blank')}
                        color="primary"
                      >
                        <ReceiptIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(item)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
                
                {item.type === 'vehicle' ? (
                  <>
                    <Typography color="textSecondary" gutterBottom>
                      VIN: {item.vehicleDetails.vin}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {item.vehicleDetails.brand} {item.vehicleDetails.model} ({item.vehicleDetails.year})
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Couleur: {item.vehicleDetails.color}
                    </Typography>
                  </>
                ) : (
                  <Typography color="textSecondary" gutterBottom>
                    N° série: {item.serialNumber}
                  </Typography>
                )}

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {item.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={item.status}
                    color={
                      item.status === 'stolen' ? 'error' :
                      item.status === 'lost' ? 'warning' :
                      item.status === 'forgotten' ? 'info' :
                      item.status === 'sold' ? 'success' : 'default'
                    }
                    sx={{ mb: 2 }}
                  />
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      size="small"
                      variant={item.status === 'stolen' ? 'contained' : 'outlined'}
                      color="error"
                      onClick={() => updateStatus(item._id, 'stolen')}
                    >
                      Volé
                    </Button>
                    <Button
                      size="small"
                      variant={item.status === 'lost' ? 'contained' : 'outlined'}
                      color="warning"
                      onClick={() => updateStatus(item._id, 'lost')}
                    >
                      Perdu
                    </Button>
                    <Button
                      size="small"
                      variant={item.status === 'forgotten' ? 'contained' : 'outlined'}
                      color="info"
                      onClick={() => updateStatus(item._id, 'forgotten')}
                    >
                      Oublié
                    </Button>
                    <Button
                      size="small"
                      variant={item.status === 'sold' ? 'contained' : 'outlined'}
                      color="success"
                      onClick={() => updateStatus(item._id, 'sold')}
                    >
                      Vendu
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Ajouter un nouveau bien</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type de bien</InputLabel>
              <Select
                name="type"
                value={newItem.type}
                onChange={handleInputChange}
              >
                <MenuItem value="vehicle">Véhicule</MenuItem>
                <MenuItem value="electronics">Électronique</MenuItem>
                <MenuItem value="furniture">Mobilier</MenuItem>
                <MenuItem value="jewelry">Bijoux</MenuItem>
                <MenuItem value="clothing">Vêtements</MenuItem>
                <MenuItem value="documents">Documents</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Nom"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            {renderVehicleFields()}

            {newItem.type !== 'vehicle' && (
              <TextField
                fullWidth
                label="Numéro de série"
                name="serialNumber"
                value={newItem.serialNumber}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            )}

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
              required
            />

            <TextField
              fullWidth
              label="Date d'achat"
              name="purchaseDate"
              type="date"
              value={newItem.purchaseDate}
              onChange={handleInputChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Prix d'achat"
              name="purchasePrice"
              type="number"
              value={newItem.purchasePrice}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span">
                  Ajouter un reçu (optionnel)
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Fichier sélectionné : {selectedFile.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenDialog(false);
              resetForm();
            }}>
              Annuler
            </Button>
            <Button type="submit" variant="contained">Ajouter</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet objet ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemDashboard;

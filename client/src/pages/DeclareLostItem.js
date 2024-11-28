import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  IconButton,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { PhotoCamera, Delete, MyLocation } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/declarations/LocationPicker';

const serialNumberTypes = [
  { value: 'IMEI', label: 'IMEI (Téléphones)' },
  { value: 'VIN', label: 'VIN (Véhicules)' },
  { value: 'CHASSIS', label: 'Numéro de châssis' },
  { value: 'SERIAL', label: 'Numéro de série standard' },
  { value: 'OTHER', label: 'Autre' },
];

const itemStatuses = [
  { value: 'LOST', label: 'Perdu', color: 'error' },
  { value: 'FORGOTTEN', label: 'Oublié', color: 'info' },
  { value: 'STOLEN', label: 'Volé', color: 'warning' },
];

const steps = ['Informations de base', 'Description et localisation', 'Contact et options'];

const DeclareLostItem = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const [formData, setFormData] = useState({
    serialNumberType: '',
    serialNumber: '',
    status: '',
    description: '',
    location: null,
    locationDetails: '',
    dateLost: null,
    email: '',
    phone: '',
    reward: '',
    isAnonymous: false,
  });

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.status || !formData.dateLost) {
          setError('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        break;
      case 1:
        if (!formData.description || !formData.location) {
          setError('Veuillez fournir une description et une localisation');
          return false;
        }
        break;
      case 2:
        if (!formData.email && !formData.phone) {
          setError('Veuillez fournir au moins un moyen de contact');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          setError('Veuillez entrer une adresse email valide');
          return false;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
          setError('Veuillez entrer un numéro de téléphone valide (10 chiffres)');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 5) {
      setError('Vous ne pouvez pas ajouter plus de 5 photos');
      return;
    }

    const newImages = [...images];
    const newPreviewImages = [...previewImages];

    files.forEach(file => {
      if (file.size > 5000000) {
        setError('Chaque image doit faire moins de 5MB');
        return;
      }

      newImages.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewImages.push(reader.result);
        setPreviewImages([...newPreviewImages]);
      };
      reader.readAsDataURL(file);
    });

    setImages(newImages);
    setError('');
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address
      }
    }));
  };

  const generateTrackingNumber = () => {
    const prefix = formData.status.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    try {
      const newTrackingNumber = generateTrackingNumber();
      setTrackingNumber(newTrackingNumber);
      
      // Simulation d'envoi au serveur
      console.log('Données du formulaire:', {
        ...formData,
        trackingNumber: newTrackingNumber,
        images
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setError('Une erreur est survenue lors de l\'envoi du formulaire');
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Statut"
                >
                  {itemStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type de numéro de série</InputLabel>
                <Select
                  name="serialNumberType"
                  value={formData.serialNumberType}
                  onChange={handleChange}
                  label="Type de numéro de série"
                >
                  {serialNumberTypes.map((type) => (
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
                label="Numéro de série"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                disabled={!formData.serialNumberType}
              />
            </Grid>
            <Grid item xs={12}>
              <DateTimePicker
                label="Date et heure de la perte"
                value={formData.dateLost}
                onChange={(newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    dateLost: newValue
                  }));
                }}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 500 }}>
                Où avez-vous perdu l'objet ?
              </Typography>
              <Box sx={{ 
                bgcolor: 'rgba(107, 70, 193, 0.03)',
                borderRadius: 2,
                p: 3,
                mb: 3
              }}>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="locationDetails"
                label="Précisions sur le lieu"
                value={formData.locationDetails}
                onChange={handleChange}
                placeholder="Exemple : Près de l'arrêt de bus, sur le banc du parc, dans les toilettes du centre commercial..."
                helperText="Ajoutez des détails qui pourraient aider à retrouver l'objet"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                name="description"
                label="Description détaillée de l'objet"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez l'objet en détail : marque, modèle, couleur, signes distinctifs..."
                error={!formData.description && error}
                helperText={!formData.description && error ? "La description est requise" : ""}
              />
            </Grid>

            {formData.serialNumberType && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="serialNumber"
                  label={`Numéro ${formData.serialNumberType}`}
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder={`Entrez le numéro ${formData.serialNumberType}`}
                />
              </Grid>
            )}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0612345678"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Récompense (optionnel)"
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                placeholder="Ex: 50€"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    name="isAnonymous"
                  />
                }
                label="Je souhaite rester anonyme"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Déclarer un objet perdu
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Votre déclaration a été enregistrée avec succès !
            {trackingNumber && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Numéro de suivi : <strong>{trackingNumber}</strong>
              </Typography>
            )}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Retour
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Soumettre
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Suivant
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DeclareLostItem;

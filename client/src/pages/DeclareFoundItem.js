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
  Alert,
  Stepper,
  Step,
  StepLabel,
  IconButton,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/map/LocationPicker';

const categories = [
  { value: 'PHONE', label: 'Téléphone' },
  { value: 'COMPUTER', label: 'Ordinateur' },
  { value: 'TABLET', label: 'Tablette' },
  { value: 'BAG', label: 'Sac' },
  { value: 'WALLET', label: 'Portefeuille' },
  { value: 'KEYS', label: 'Clés' },
  { value: 'JEWELRY', label: 'Bijoux' },
  { value: 'CLOTHING', label: 'Vêtements' },
  { value: 'DOCUMENTS', label: 'Documents' },
  { value: 'OTHER', label: 'Autre' },
];

const serialNumberTypes = [
  { value: 'IMEI', label: 'IMEI (Téléphones)', format: /^\d{15}$/, placeholder: '123456789012345' },
  { value: 'VIN', label: 'VIN (Véhicules)', format: /^[A-HJ-NPR-Z0-9]{17}$/, placeholder: 'WVWZZZ1JZXW000001' },
  { value: 'CHASSIS', label: 'Numéro de châssis', format: /^[A-Z0-9]{6,17}$/, placeholder: 'ABC123456789' },
  { value: 'SERIAL', label: 'Numéro de série standard', format: /^[A-Z0-9-]{4,}$/, placeholder: 'SN-12345' },
  { value: 'OTHER', label: 'Autre', format: /.*/, placeholder: 'Entrez le numéro' },
];

const steps = ['Informations de base', 'Photos et localisation', 'Contact'];

const DeclareFoundItem = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [declarationId, setDeclarationId] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    categoryDetails: '',
    serialNumberType: '',
    serialNumber: '',
    description: '',
    location: null,
    address: '',
    dateFound: null,
    email: '',
    phone: '',
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
        if (!formData.category || !formData.description || !formData.dateFound) {
          setError('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        if (formData.serialNumberType && !formData.serialNumber) {
          setError('Veuillez entrer le numéro de série');
          return false;
        }
        if (formData.serialNumber) {
          const selectedType = serialNumberTypes.find(type => type.value === formData.serialNumberType);
          if (selectedType && !selectedType.format.test(formData.serialNumber)) {
            setError(`Format invalide pour le numéro ${selectedType.label}`);
            return false;
          }
        }
        break;
      case 1:
        if (!formData.location || !formData.address) {
          setError('Veuillez indiquer la localisation');
          return false;
        }
        if (images.length < 3) {
          setError('Veuillez ajouter au moins 3 photos');
          return false;
        }
        if (images.length > 5) {
          setError('Vous ne pouvez pas ajouter plus de 5 photos');
          return false;
        }
        break;
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
          setError('Veuillez entrer une adresse email valide');
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

  const generateDeclarationId = () => {
    const prefix = 'TR';
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    try {
      const newDeclarationId = generateDeclarationId();
      setDeclarationId(newDeclarationId);
      
      // Simulation d'envoi au serveur
      console.log('Données du formulaire:', {
        ...formData,
        declarationId: newDeclarationId,
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Catégorie"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Précisions sur la catégorie"
                name="categoryDetails"
                value={formData.categoryDetails}
                onChange={handleChange}
                placeholder="Ex: iPhone, Samsung Galaxy, etc."
              />
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
                placeholder={
                  formData.serialNumberType
                    ? serialNumberTypes.find(type => type.value === formData.serialNumberType)?.placeholder
                    : "Sélectionnez d'abord un type"
                }
                helperText={
                  formData.serialNumberType === 'IMEI'
                    ? "L'IMEI se trouve dans les paramètres du téléphone ou en composant *#06#"
                    : formData.serialNumberType === 'VIN'
                    ? "Le VIN se trouve sur la carte grise ou sur le châssis du véhicule"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description détaillée"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez l'objet le plus précisément possible (marque, modèle, couleur, état, etc.)"
              />
            </Grid>
            <Grid item xs={12}>
              <DateTimePicker
                label="Date et heure de la découverte"
                value={formData.dateFound}
                onChange={(newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    dateFound: newValue
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
              <Typography variant="subtitle1" gutterBottom>
                Localisation
              </Typography>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Adresse précise"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Numéro, rue, code postal, ville"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
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
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  3 photos minimum, 5 maximum (5MB par photo)
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {previewImages.map((preview, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '100%',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
              />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Votre email est obligatoire mais ne sera pas visible publiquement
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0612345678"
              />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Votre numéro de téléphone ne sera visible que par les administrateurs
              </Typography>
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
          Déclarer un objet trouvé
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
            {declarationId && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Numéro de déclaration : <strong>{declarationId}</strong>
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

export default DeclareFoundItem;

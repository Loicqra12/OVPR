import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  Input,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress,
  Tooltip,
  IconButton,
  Paper,
  Chip,
  RadioGroup,
  Radio,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Phone as PhoneIcon,
  DirectionsCar as VehicleIcon,
  Diamond as JewelryIcon,
  Description as DocumentIcon,
  Work as AccessoryIcon,
  Help as OtherIcon,
  PhotoCamera as CameraIcon,
  MyLocation as LocationIcon,
  AccessTime as TimeIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { fr } from 'date-fns/locale';
import ReCAPTCHA from 'react-google-recaptcha';
import PhotoUpload from './PhotoUpload';
import LocationPicker from './LocationPicker';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Définition des catégories avec leurs icônes
const categories = [
  { value: 'phone', label: 'Téléphone', icon: <PhoneIcon /> },
  { value: 'vehicle', label: 'Véhicule', icon: <VehicleIcon /> },
  { value: 'jewelry', label: 'Bijoux', icon: <JewelryIcon /> },
  { value: 'documents', label: 'Documents', icon: <DocumentIcon /> },
  { value: 'accessories', label: 'Accessoires', icon: <AccessoryIcon /> },
  { value: 'other', label: 'Autre', icon: <OtherIcon /> }
];

// Types d'identification par catégorie
const identificationTypes = {
  phone: [
    { value: 'imei', label: 'Numéro IMEI' },
    { value: 'serial', label: 'Numéro de série' }
  ],
  vehicle: [
    { value: 'vin', label: 'Numéro VIN' },
    { value: 'chassis', label: 'Numéro de châssis' }
  ],
  documents: [
    { value: 'docNumber', label: 'Numéro du document' }
  ],
  default: [
    { value: 'serial', label: 'Numéro de série' },
    { value: 'other', label: 'Autre identifiant' }
  ]
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  overflow: 'visible'
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '1rem',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(3)
}));

const PhotoUploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const steps = [
  'Catégorie',
  'Identification',
  'Description',
  'Localisation',
  'Contact',
  'Confirmation'
];

const initialFormData = {
  category: '',
  otherCategory: '',
  identificationType: '',
  identificationNumber: '',
  description: '',
  photos: [],
  location: null,
  locationDetails: '',
  date: new Date(),
  approximateDate: false,
  declaredToPolice: null,
  policeStation: '',
  email: '',
  phone: '',
  hidePhone: true,
  alternativeContact: '',
  registrationNumber: '',
  acceptedTerms: false,
  captchaValue: null
};

const DeclareFound = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [showSuccess, setShowSuccess] = useState(false);

  // Style pour le conteneur principal
  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: 'rgba(107, 70, 193, 0.03)', // Légère teinte violette
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(107, 70, 193, 0.1)',
  };

  // Style pour les étapes
  const stepStyle = {
    '& .MuiStepLabel-root .Mui-completed': {
      color: '#6B46C1', // Violet principal
    },
    '& .MuiStepLabel-root .Mui-active': {
      color: '#9F7AEA', // Violet clair
    },
  };

  const generateRegistrationNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `OVPR-FOUND-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async () => {
    // Validation des champs requis
    if (formData.declaredToPolice && !formData.policeStation) {
      alert("Veuillez indiquer le nom et l'adresse du commissariat ou de la gendarmerie où vous avez fait la déclaration.");
      return;
    }

    try {
      // Simulation d'envoi au serveur
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  const handleNewDeclaration = () => {
    setFormData(initialFormData);
    setActiveStep(0);
    setShowSuccess(false);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 2) {
      alert("Vous ne pouvez télécharger que 2 photos maximum");
      return;
    }

    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/png'].includes(file.type) && 
      file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length !== files.length) {
      alert("Certains fichiers ne sont pas valides. Utilisez uniquement des fichiers JPG ou PNG de moins de 5MB.");
      return;
    }

    setFormData(prevData => ({
      ...prevData,
      photos: validFiles
    }));

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    // setPhotoPreview(newPreviews);
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: event.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prevData => ({
      ...prevData,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address
      }
    }));
  };

  const handleCaptchaChange = (value) => {
    setFormData(prevData => ({
      ...prevData,
      captchaValue: value
    }));
  };

  // Composant de succès
  const SuccessScreen = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Box sx={{ 
        width: '80px', 
        height: '80px', 
        margin: '0 auto 24px',
        backgroundColor: 'rgba(107, 70, 193, 0.1)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CheckCircleIcon sx={{ fontSize: 40, color: '#6B46C1' }} />
      </Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
        Déclaration enregistrée avec succès !
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Votre numéro de déclaration : {generateRegistrationNumber()}
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewDeclaration}
          startIcon={<AddIcon />}
        >
          Nouvelle déclaration
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/')}
          startIcon={<HomeIcon />}
        >
          Retour à l'accueil
        </Button>
      </Box>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Catégorie de l'objet</InputLabel>
                <Select
                  value={formData.category}
                  name="category"
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        <Typography>{category.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {formData.category === 'other' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Précisez la catégorie"
                  name="otherCategory"
                  value={formData.otherCategory}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type d'identification</InputLabel>
                <Select
                  value={formData.identificationType}
                  name="identificationType"
                  onChange={handleChange}
                  required
                >
                  {(identificationTypes[formData.category] || identificationTypes.default).map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {formData.identificationType && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="identificationNumber"
                  label={(identificationTypes[formData.category] || identificationTypes.default).find(t => t.value === formData.identificationType)?.label}
                  value={formData.identificationNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description détaillée"
                value={formData.description}
                onChange={handleChange}
                required
                helperText="Décrivez l'objet en détail (couleur, marque, état, particularités)"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Photos de l'objet
              </Typography>
              <PhotoUpload
                photos={[]}
                setPhotos={() => {}}
                maxPhotos={4}
                handlePhotoUpload={handlePhotoUpload}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: 'rgba(107, 70, 193, 0.03)',
                border: '1px solid rgba(107, 70, 193, 0.1)'
              }}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  Avez-vous déclaré ou déposé cet objet à la police ou à la gendarmerie ?
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="declaredToPolice"
                    value={formData.declaredToPolice}
                    onChange={(e) => {
                      const value = e.target.value === 'true';
                      setFormData(prev => ({
                        ...prev,
                        declaredToPolice: value,
                        // Réinitialiser le champ policeStation si "Non" est sélectionné
                        policeStation: value ? prev.policeStation : ''
                      }));
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <FormControlLabel
                        value="true"
                        control={
                          <Radio 
                            sx={{
                              '&.Mui-checked': {
                                color: 'primary.main',
                              }
                            }}
                          />
                        }
                        label="Oui"
                      />
                      <FormControlLabel
                        value="false"
                        control={
                          <Radio 
                            sx={{
                              '&.Mui-checked': {
                                color: 'primary.main',
                              }
                            }}
                          />
                        }
                        label="Non"
                      />
                    </Box>
                  </RadioGroup>
                </FormControl>

                {formData.declaredToPolice && (
                  <Collapse in={formData.declaredToPolice}>
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        name="policeStation"
                        label="Nom et adresse du commissariat ou de la gendarmerie"
                        value={formData.policeStation}
                        onChange={handleChange}
                        placeholder="Ex: Commissariat central de Dakar, Avenue Léopold Sédar Senghor"
                        required={formData.declaredToPolice}
                        helperText={
                          formData.declaredToPolice && !formData.policeStation 
                            ? "Veuillez indiquer où vous avez fait la déclaration"
                            : ""
                        }
                        error={formData.declaredToPolice && !formData.policeStation}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    </Box>
                  </Collapse>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Localisation de l'objet trouvé
              </Typography>
              <LocationPicker
                onLocationSelect={handleLocationSelect}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="locationDetails"
                label="Précisions sur le lieu"
                value={formData.locationDetails}
                onChange={handleChange}
                placeholder="Ex: Près de l'entrée principale, sous le banc..."
              />
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DateTimePicker
                  label="Date et heure de découverte"
                  value={formData.date}
                  onChange={(newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      date: newValue
                    }));
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="approximateDate"
                    checked={formData.approximateDate}
                    onChange={handleChange}
                  />
                }
                label="Je ne suis pas sûr de la date exacte"
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="phone"
                label="Téléphone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="hidePhone"
                    checked={formData.hidePhone}
                    onChange={handleChange}
                  />
                }
                label="Masquer le numéro de téléphone"
              />
            </Grid>

            {formData.hidePhone && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="alternativeContact"
                  label="Contact alternatif"
                  value={formData.alternativeContact}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}
          </Grid>
        );

      case 5:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ReCAPTCHA
                sitekey="YOUR_RECAPTCHA_SITE_KEY"
                onChange={handleCaptchaChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                  />
                }
                label="J'accepte les conditions générales d'utilisation"
              />
            </Grid>

            {formData.registrationNumber && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Déclaration enregistrée
                  </Typography>
                  <Typography variant="body1">
                    Numéro d'enregistrement: {formData.registrationNumber}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Un email de confirmation a été envoyé à votre adresse.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Box sx={containerStyle}>
        {!showSuccess ? (
          <>
            <Typography variant="h4" gutterBottom sx={{ 
              color: '#2D3748',
              textAlign: 'center',
              mb: 4,
              fontWeight: 600
            }}>
              Déclarer un objet trouvé
            </Typography>

            <Stepper activeStep={activeStep} sx={stepStyle}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 4 }}>
              {getStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBackIcon />}
                >
                  Retour
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    endIcon={<SendIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #6B46C1 30%, #9F7AEA 90%)',
                      boxShadow: '0 3px 5px 2px rgba(107, 70, 193, .3)',
                    }}
                  >
                    Enregistrer
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Suivant
                  </Button>
                )}
              </Box>
            </Box>
          </>
        ) : (
          <SuccessScreen />
        )}
      </Box>
    </Container>
  );
};

export default DeclareFound;

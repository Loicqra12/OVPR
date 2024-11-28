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
  InputAdornment,
  Link,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fr } from 'date-fns/locale';
import { styled } from '@mui/material/styles';
import ReCAPTCHA from 'react-google-recaptcha';
import LocationPicker from './LocationPicker';

const categories = [
  'Électronique',
  'Accessoires',
  'Vêtements',
  'Véhicules',
  'Documents',
  'Bijoux',
  'Autre'
];

const statusOptions = [
  { value: 'lost', label: 'Perdu', color: 'blue' },
  { value: 'stolen', label: 'Volé', color: 'red' },
  { value: 'forgotten', label: 'Oublié', color: 'orange' }
];

const steps = ['Informations générales', 'Détails et identification', 'Localisation', 'Contact', 'Confirmation'];

const identificationTypes = {
  'Électronique': [
    { value: 'serial', label: 'Numéro de série', placeholder: 'Ex: SN123456789' },
    { value: 'imei', label: 'Numéro IMEI', placeholder: 'Ex: 123456789012345' },
    { value: 'mac', label: 'Adresse MAC', placeholder: 'Ex: 00:1A:2B:3C:4D:5E' }
  ],
  'Véhicules': [
    { value: 'vin', label: 'Numéro de châssis (VIN)', placeholder: 'Ex: WVWZZZ1JZ3W386752' },
    { value: 'license', label: 'Numéro d\'immatriculation', placeholder: 'Ex: AB-123-CD' },
    { value: 'engine', label: 'Numéro de moteur', placeholder: 'Ex: 123456789' }
  ],
  'Bijoux': [
    { value: 'serial', label: 'Numéro de série', placeholder: 'Ex: BJ123456' },
    { value: 'certificate', label: 'Numéro de certificat d\'authenticité', placeholder: 'Ex: CERT123456' }
  ],
  'Documents': [
    { value: 'id', label: 'Numéro d\'identification', placeholder: 'Ex: 123456789' },
    { value: 'passport', label: 'Numéro de passeport', placeholder: 'Ex: 12AB34567' },
    { value: 'license', label: 'Numéro de permis', placeholder: 'Ex: 12345678' }
  ]
};

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const DeclareLost = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Informations générales
    title: '',
    description: '',
    category: '',
    status: '',
    itemCount: 1,
    photos: [],
    
    // Détails et identification
    hasPoliceReport: 'non',
    identificationType: '',
    identificationNumber: '',
    policeReportNumber: '',
    policeStation: '',
    declarationDate: null,
    
    // Localisation
    location: null,
    locationDetails: '',
    searchRadius: '',
    address: '',
    
    // Contact
    name: '',
    email: '',
    phone: '',
    address: '',
    
    // Système
    registrationNumber: '',
    additionalInfo: '',
    
    // Récompense
    offerReward: false,
    rewardAmount: '',
    rewardDescription: '',
    acceptedTerms: false,
  });

  const [photoPreview, setPhotoPreview] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    let isValid = true;
    let errorMessage = '';

    switch (activeStep) {
      case 2: // Validation de l'étape Localisation
        if (!formData.location) {
          isValid = false;
          errorMessage = 'Veuillez sélectionner un emplacement sur la carte';
        }
        break;
    }

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setError('');
    } else {
      setError(errorMessage);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const generateRegistrationNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `OVPR-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.acceptedTerms) {
      setError("Vous devez accepter les conditions générales d'utilisation pour continuer.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const registrationNumber = generateRegistrationNumber();
      const finalFormData = {
        ...formData,
        registrationNumber,
        submissionDate: new Date().toISOString()
      };

      // TODO: Implement API call
      console.log('Form submitted:', finalFormData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFormData(prevData => ({
        ...prevData,
        registrationNumber
      }));

      handleNext();
    } catch (error) {
      setError("Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.");
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type) && 
      file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length !== files.length) {
      // TODO: Show error message about invalid files
    }

    setFormData(prevData => ({
      ...prevData,
      photos: [...prevData.photos, ...validFiles]
    }));

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPhotoPreview(prev => [...prev, ...newPreviews]);
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location: location
    }));
  };

  const renderIdentificationFields = () => {
    const category = formData.category;
    if (!category || !identificationTypes[category]) {
      return (
        <Grid item xs={12}>
          <Typography color="textSecondary">
            Veuillez d'abord sélectionner une catégorie pour voir les types d'identification disponibles.
          </Typography>
        </Grid>
      );
    }

    return (
      <>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Type d'identification</InputLabel>
            <Select
              name="identificationType"
              value={formData.identificationType}
              onChange={handleChange}
              label="Type d'identification"
            >
              {identificationTypes[category].map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Sélectionnez le type d'identification approprié pour votre {category.toLowerCase()}
            </FormHelperText>
          </FormControl>
        </Grid>

        {formData.identificationType && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              name="identificationNumber"
              label={identificationTypes[category].find(t => t.value === formData.identificationType)?.label}
              placeholder={identificationTypes[category].find(t => t.value === formData.identificationType)?.placeholder}
              value={formData.identificationNumber}
              onChange={handleChange}
              helperText="Entrez le numéro correspondant au type sélectionné"
            />
          </Grid>
        )}

        {/* Option pour ajouter un numéro d'identification supplémentaire */}
        {formData.identificationType && (
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                // TODO: Implémenter l'ajout d'un numéro d'identification supplémentaire
                console.log('Ajouter un autre numéro');
              }}
              sx={{ mt: 1 }}
            >
              + Ajouter un autre numéro d'identification
            </Button>
          </Grid>
        )}
      </>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="title"
                label="Titre"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
              />
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
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Statut"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Numéros d'identification
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Selon la catégorie sélectionnée, veuillez fournir les numéros d'identification appropriés
              </Typography>
            </Grid>

            {renderIdentificationFields()}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Déclaration de police
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Avez-vous fait une déclaration à la police ?</InputLabel>
                <Select
                  name="hasPoliceReport"
                  value={formData.hasPoliceReport}
                  onChange={handleChange}
                  label="Avez-vous fait une déclaration à la police ?"
                >
                  <MenuItem value="oui">Oui</MenuItem>
                  <MenuItem value="non">Non</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.hasPoliceReport === 'oui' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    name="policeReportNumber"
                    label="Numéro de déclaration"
                    value={formData.policeReportNumber}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    name="policeStation"
                    label="Commissariat de police"
                    value={formData.policeStation}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <DatePicker
                      label="Date de la déclaration"
                      value={formData.declarationDate}
                      onChange={(newValue) => {
                        setFormData(prevData => ({
                          ...prevData,
                          declarationDate: newValue
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          required
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Où avez-vous perdu l'objet ?
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Précisions sur le lieu"
              name="locationDetails"
              value={formData.locationDetails}
              onChange={handleChange}
              placeholder="Exemple : Près de l'arrêt de bus, sur le banc du parc, dans les toilettes du centre commercial..."
              helperText="Ajoutez des détails qui pourraient aider à retrouver l'objet"
              sx={{ mt: 2 }}
            />
          </Box>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Proposition de récompense (facultatif)
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="offerReward"
                    checked={formData.offerReward}
                    onChange={handleChange}
                  />
                }
                label="Je souhaite proposer une récompense"
              />
            </Grid>

            {formData.offerReward && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="rewardAmount"
                    label="Montant de la récompense (FCFA)"
                    type="number"
                    value={formData.rewardAmount}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    name="rewardDescription"
                    label="Description de la récompense (optionnel)"
                    value={formData.rewardDescription}
                    onChange={handleChange}
                    placeholder="Précisez les conditions ou détails de la récompense"
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="name"
                label="Nom complet"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="phone"
                label="Téléphone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Adresse"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Confirmation
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                required
                control={
                  <Checkbox
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    J'atteste avoir lu et accepté les{' '}
                    <Link href="/terms" target="_blank" rel="noopener">
                      conditions générales d'utilisation
                    </Link>{' '}
                    de OVPR.
                  </Typography>
                }
              />
              {!formData.acceptedTerms && error && (
                <FormHelperText error>
                  Vous devez accepter les conditions générales d'utilisation pour continuer.
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <ReCAPTCHA
                sitekey="YOUR_RECAPTCHA_SITE_KEY"
                onChange={() => console.log('ReCAPTCHA changed')}
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardContent>
          <Box mb={4}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Déclarer un objet perdu
            </Typography>
            <Typography variant="body1" color="textSecondary" align="center">
              Remplissez ce formulaire avec le plus de détails possible pour maximiser les chances de retrouver votre objet.
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            {activeStep === 0 && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Photos de l'objet
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    >
                      Ajouter des photos
                      <VisuallyHiddenInput
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handlePhotoUpload}
                      />
                    </Button>
                    <FormHelperText>
                      Formats acceptés: JPEG, PNG, GIF. Taille maximale: 5MB par fichier
                    </FormHelperText>
                  </Grid>
                  {photoPreview.length > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                        {photoPreview.map((url, index) => (
                          <Box
                            key={index}
                            component="img"
                            src={url}
                            sx={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack}>
                  Retour
                </Button>
              )}
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Soumettre la déclaration
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Suivant
                </Button>
              )}
            </Box>
          </form>

          {formData.registrationNumber && (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
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
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default DeclareLost;

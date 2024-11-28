import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

// Liste des indicatifs de pays les plus courants
const countryCodes = [
  { code: '+33', country: 'France ' },
  { code: '+1', country: 'États-Unis/Canada ' },
  { code: '+44', country: 'Royaume-Uni ' },
  { code: '+32', country: 'Belgique ' },
  { code: '+41', country: 'Suisse ' },
  { code: '+212', country: 'Maroc ' },
  { code: '+213', country: 'Algérie ' },
  { code: '+216', country: 'Tunisie ' },
  { code: '+221', country: 'Sénégal ' },
  { code: '+225', country: 'Côte d\'Ivoire ' },
  { code: '+237', country: 'Cameroun ' },
  { code: '+243', country: 'RD Congo ' },
  { code: '+49', country: 'Allemagne ' },
  { code: '+34', country: 'Espagne ' },
  { code: '+39', country: 'Italie ' },
  { code: '+351', country: 'Portugal ' },
  { code: '+31', country: 'Pays-Bas ' },
  { code: '+352', country: 'Luxembourg ' },
  { code: '+242', country: 'Congo ' },
  { code: '+223', country: 'Mali ' },
  { code: '+226', country: 'Burkina Faso ' },
  { code: '+227', country: 'Niger ' },
  { code: '+235', country: 'Tchad ' },
  { code: '+236', country: 'République centrafricaine ' },
  { code: '+241', country: 'Gabon ' },
  { code: '+245', country: 'Guinée-Bissau ' },
  { code: '+261', country: 'Madagascar ' },
  { code: '+229', country: 'Bénin ' },
  { code: '+228', country: 'Togo ' },
  { code: '+222', country: 'Mauritanie ' },
  { code: '+230', country: 'Maurice ' },
  { code: '+262', country: 'Réunion ' },
  { code: '+377', country: 'Monaco ' },
  { code: '+590', country: 'Guadeloupe ' },
  { code: '+596', country: 'Martinique ' },
  { code: '+594', country: 'Guyane française ' },
  { code: '+687', country: 'Nouvelle-Calédonie ' },
  { code: '+689', country: 'Polynésie française ' }
].sort((a, b) => a.country.localeCompare(b.country));

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    phoneCountryCode: '+33',
    whatsappNumber: '',
    whatsappCountryCode: '+33'
  });
  const [error, setError] = useState('');

  const steps = ['Informations personnelles', 'Contact', 'Sécurité'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }
    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      
      // Rediriger vers la page d'accueil
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Vos informations
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="Prénom"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Nom"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Pseudonyme"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                helperText="Ce pseudonyme sera visible par les autres utilisateurs"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                <ContactPhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Vos coordonnées
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Adresse email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                '& .MuiFormControl-root': {
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                }
              }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="phone-country-code-label">Pays (Tél.)</InputLabel>
                  <Select
                    labelId="phone-country-code-label"
                    id="phoneCountryCode"
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={handleChange}
                    label="Pays (Tél.)"
                  >
                    {countryCodes.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.country} ({country.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Numéro de téléphone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  inputProps={{
                    pattern: "[0-9]{9,10}",
                  }}
                  helperText="Sans le 0 initial"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                '& .MuiFormControl-root': {
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                }
              }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="whatsapp-country-code-label">Pays (WhatsApp)</InputLabel>
                  <Select
                    labelId="whatsapp-country-code-label"
                    id="whatsappCountryCode"
                    name="whatsappCountryCode"
                    value={formData.whatsappCountryCode}
                    onChange={handleChange}
                    label="Pays (WhatsApp)"
                  >
                    {countryCodes.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.country} ({country.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  id="whatsappNumber"
                  label="Numéro WhatsApp"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WhatsAppIcon sx={{ color: '#25D366' }} />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    pattern: "[0-9]{9,10}",
                  }}
                  helperText="Optionnel - Sans le 0 initial"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#25D366',
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                <LockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sécurisation du compte
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                helperText="8 caractères minimum, incluant majuscules, minuscules et chiffres"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="confirmPassword"
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 
                  "Les mots de passe ne correspondent pas" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)'
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
          Inscription
        </Typography>

        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ mr: 1 }}
            >
              Retour
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                },
              }}
            >
              {activeStep === steps.length - 1 ? 'S\'inscrire' : 'Suivant'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
            Connectez-vous ici
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;

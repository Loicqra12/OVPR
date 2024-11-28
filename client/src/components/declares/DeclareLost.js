import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import CommonFields from './CommonFields';

const steps = ['Informations générales', 'Vérification', 'Confirmation'];

const DeclareLost = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    date: null,
    location: '',
    brand: '',
    model: '',
    color: '',
    registration: '',
    vin: '',
    breed: '',
    name: '',
    chip: '',
    characteristics: '',
    distinguishingFeatures: '',
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      date: newValue,
    }));
  };

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    handleNext();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CommonFields
            formData={formData}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
          />
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Vérifiez vos informations
            </Typography>
            <Typography component="div">
              <Box sx={{ mb: 2 }}>
                <strong>Catégorie:</strong> {formData.category}
                <br />
                <strong>Sous-catégorie:</strong> {formData.subcategory}
                <br />
                <strong>Titre:</strong> {formData.title}
                <br />
                <strong>Description:</strong> {formData.description}
                <br />
                <strong>Date:</strong> {formData.date?.toLocaleDateString('fr-FR')}
                <br />
                <strong>Lieu:</strong> {formData.location}
              </Box>

              {formData.category === 'vehicle' && (
                <Box sx={{ mb: 2 }}>
                  <strong>Marque:</strong> {formData.brand}
                  <br />
                  <strong>Modèle:</strong> {formData.model}
                  <br />
                  <strong>Couleur:</strong> {formData.color}
                  <br />
                  {formData.vin && (
                    <>
                      <strong>Numéro de châssis (VIN):</strong> {formData.vin}
                      <br />
                    </>
                  )}
                  {formData.registration && (
                    <>
                      <strong>Immatriculation:</strong> {formData.registration}
                      <br />
                    </>
                  )}
                </Box>
              )}

              {formData.category === 'animal' && (
                <Box sx={{ mb: 2 }}>
                  <strong>Race:</strong> {formData.breed}
                  <br />
                  <strong>Nom:</strong> {formData.name}
                  <br />
                  <strong>Couleur:</strong> {formData.color}
                  <br />
                  {formData.chip && (
                    <>
                      <strong>Puce/Tatouage:</strong> {formData.chip}
                      <br />
                    </>
                  )}
                  {formData.distinguishingFeatures && (
                    <>
                      <strong>Signes distinctifs:</strong> {formData.distinguishingFeatures}
                      <br />
                    </>
                  )}
                </Box>
              )}

              {formData.characteristics && (
                <Box>
                  <strong>Caractéristiques particulières:</strong>
                  <br />
                  {formData.characteristics}
                </Box>
              )}
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Déclaration enregistrée
            </Typography>
            <Typography>
              Votre déclaration a été enregistrée avec succès. Vous recevrez une confirmation par email.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return (
          formData.category &&
          formData.subcategory &&
          formData.title &&
          formData.description &&
          formData.date &&
          formData.location
        );
      case 1:
        return true;
      default:
        return true;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Déclarer un objet perdu
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Retour
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => window.location.href = '/'}
            >
              Retour à l'accueil
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 2 ? handleSubmit : handleNext}
              disabled={!isStepValid(activeStep)}
            >
              {activeStep === steps.length - 2 ? 'Soumettre' : 'Suivant'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default DeclareLost;

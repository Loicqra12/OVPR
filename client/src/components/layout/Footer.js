import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import logo from '../../assets/logoovpr.PNG';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo et Description */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src={logo}
                alt="OVPR Logo"
                style={{
                  height: '40px',
                  marginRight: '10px'
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                OVPR
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              La plateforme de confiance pour retrouver vos objets perdus et protéger vos biens.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white' }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white' }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white' }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white' }}
              >
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          {/* Navigation Rapide */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Navigation Rapide
            </Typography>
            <Stack spacing={1}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                Accueil
              </Link>
              <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                Tableau de bord
              </Link>
              <Link to="/declare-lost" style={{ color: 'white', textDecoration: 'none' }}>
                Déclarer un objet perdu
              </Link>
              <Link to="/declare-found" style={{ color: 'white', textDecoration: 'none' }}>
                Déclarer un objet trouvé
              </Link>
            </Stack>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <Stack spacing={1}>
              <Link to="/add-item" style={{ color: 'white', textDecoration: 'none' }}>
                Enregistrer un objet
              </Link>
              <Link to="/advanced-search" style={{ color: 'white', textDecoration: 'none' }}>
                Recherche avancée
              </Link>
              <Link to="/map" style={{ color: 'white', textDecoration: 'none' }}>
                Carte des objets
              </Link>
              <Link to="/notifications" style={{ color: 'white', textDecoration: 'none' }}>
                Notifications
              </Link>
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} />
                <Typography variant="body2">
                  123 Rue de la République, 75001 Paris
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1 }} />
                <Typography variant="body2">
                  +33 1 23 45 67 89
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1 }} />
                <Typography variant="body2">
                  contact@ovpr.fr
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright et Liens légaux */}
        <Box
          sx={{
            mt: 5,
            pt: 3,
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="white" paragraph>
            {currentYear} OVPR. Tous droits réservés.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Link to="/privacy" style={{ color: 'white', textDecoration: 'none' }}>
              Politique de confidentialité
            </Link>
            <Link to="/terms" style={{ color: 'white', textDecoration: 'none' }}>
              Conditions d'utilisation
            </Link>
            <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>
              Nous contacter
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

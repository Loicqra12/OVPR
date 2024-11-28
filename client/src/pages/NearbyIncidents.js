import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import IncidentMap from '../components/map/IncidentMap';

const NearbyIncidents = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* En-tête */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Carte des Incidents
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Visualisez les zones à risque et les incidents signalés dans votre région
          </Typography>
          <Chip
            icon={<WarningIcon />}
            label="Mise à jour en temps réel"
            color="primary"
            sx={{ mt: 1 }}
          />
        </Box>

        {/* Carte principale */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <IncidentMap />
        </Paper>

        {/* Statistiques et informations */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Zones à haut risque
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Zones avec plus de 5 incidents signalés au cours des 30 derniers jours.
                  Soyez particulièrement vigilant dans ces secteurs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Zones à risque modéré
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Zones avec 3 à 5 incidents signalés. Restez attentif et évitez
                  les déplacements seul la nuit.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Conseils de sécurité
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Évitez les zones à risque la nuit
                  <br />
                  • Restez vigilant et conscient de votre environnement
                  <br />
                  • Signalez tout incident suspect
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default NearbyIncidents;

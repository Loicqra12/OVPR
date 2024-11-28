import React from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';
import { testAnnouncements } from './testData';
import ImageGallery from '../components/item/ImageGallery';

const ImageSystemTest = () => {
  // Utiliser le premier élément des annonces de test
  const testItem = testAnnouncements[0];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test du Système d'Images
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Galerie d'images avec zoom
          </Typography>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <ImageGallery images={testItem.images} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ImageSystemTest;

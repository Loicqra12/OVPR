import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import ProductGallery from '../components/product/ProductGallery';

const testImages = [
  {
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    alt: 'Sneaker - Vue de face',
    title: 'Vue principale'
  },
  {
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    alt: 'Sneaker - Vue de côté',
    title: 'Vue latérale'
  },
  {
    url: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6',
    alt: 'Sneaker - Vue de dessus',
    title: 'Vue du dessus'
  },
  {
    url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    alt: 'Sneaker - Vue arrière',
    title: 'Vue arrière'
  },
  {
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
    alt: 'Sneaker - Vue de la semelle',
    title: 'Semelle'
  },
  {
    url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
    alt: 'Sneaker - Vue des détails',
    title: 'Détails'
  }
];

const ProductGalleryTest = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Galerie Produit - Sneakers
      </Typography>

      <Typography variant="body1" paragraph>
        Exemple de galerie avec 6 vues différentes d'une paire de sneakers :
      </Typography>

      <Typography component="ul" sx={{ mb: 4 }}>
        <Typography component="li">Vue principale de face</Typography>
        <Typography component="li">Vue latérale</Typography>
        <Typography component="li">Vue de dessus</Typography>
        <Typography component="li">Vue arrière</Typography>
        <Typography component="li">Vue de la semelle</Typography>
        <Typography component="li">Vue détaillée</Typography>
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
        <ProductGallery images={testImages} />
      </Paper>
    </Container>
  );
};

export default ProductGalleryTest;

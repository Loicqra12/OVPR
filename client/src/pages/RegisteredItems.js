import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/dashboard/ItemCard';

const RegisteredItems = () => {
  const navigate = useNavigate();

  // Données de test pour les biens (à remplacer par des données de l'API)
  const testItems = [
    {
      id: 1,
      name: 'iPhone 13 Pro',
      description: 'Smartphone Apple en parfait état, couleur graphite',
      category: 'Smartphones',
      brand: 'Apple',
      value: {
        amount: 800000,
        currency: 'XOF'
      },
      identifierType: 'imei',
      identifierNumber: '352789104563217',
      status: 'active',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1632661674596-df3906e86ced?q=80&w=1000&auto=format&fit=crop',
          caption: 'Vue frontale'
        }
      ]
    },
    {
      id: 2,
      name: 'MacBook Pro M1',
      description: 'Ordinateur portable Apple, 16GB RAM, 512GB SSD',
      category: 'Ordinateurs',
      brand: 'Apple',
      value: {
        amount: 1500000,
        currency: 'XOF'
      },
      identifierType: 'serial',
      identifierNumber: 'C02G5KZTML7H',
      status: 'active',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
          caption: 'Vue de dessus'
        }
      ]
    },
    {
      id: 3,
      name: 'Yamaha NMAX',
      description: 'Scooter 125cc, couleur bleue, excellent état',
      category: 'Cyclomoteurs',
      brand: 'Yamaha',
      value: {
        amount: 2000000,
        currency: 'XOF'
      },
      identifierType: 'vin',
      identifierNumber: 'JY4AM07Y4LA015342',
      status: 'active',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=1000&auto=format&fit=crop',
          caption: 'Vue latérale'
        }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Mes Biens Enregistrés
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/add-item')}
          >
            Ajouter un Bien
          </Button>
        </Box>

        <Grid container spacing={3}>
          {testItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <ItemCard item={item} />
            </Grid>
          ))}
        </Grid>

        {testItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Aucun bien enregistré pour le moment
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RegisteredItems;

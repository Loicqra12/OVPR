import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import InteractiveMap from './InteractiveMap';

const MapPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // TODO: Remplacer par un appel API réel
    const mockItems = [
      {
        id: 1,
        name: 'iPhone 13',
        type: 'lost',
        description: 'Perdu hier soir',
        latitude: 5.3600,
        longitude: -4.0083,
        date: new Date(),
        status: 'lost'
      },
      {
        id: 2,
        name: 'Sac à main',
        type: 'found',
        description: 'Trouvé ce matin',
        latitude: 5.3590,
        longitude: -4.0073,
        date: new Date(),
        status: 'found'
      }
    ];
    
    setItems(mockItems);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Carte des objets
      </Typography>
      
      <Paper sx={{ height: '70vh', p: 0, overflow: 'hidden' }}>
        <InteractiveMap
          items={items}
          initialCenter={[5.3600, -4.0083]} // Abidjan
        />
      </Paper>
    </Container>
  );
};

export default MapPage;

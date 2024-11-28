import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Box sx={{ position: 'absolute', right: -10, top: -10, opacity: 0.1 }}>
          {React.cloneElement(icon, { sx: { fontSize: 100, color } })}
        </Box>
        <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;

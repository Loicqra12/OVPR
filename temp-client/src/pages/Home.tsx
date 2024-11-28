import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          OVPR System
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Object Verification and Property Recovery System
        </Typography>
        
        <Box sx={{ mt: 4, mb: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Secure Verification
                </Typography>
                <Typography color="textSecondary">
                  Verify the authenticity and ownership of valuable items using our secure system.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Easy Search
                </Typography>
                <Typography color="textSecondary">
                  Quick and efficient search for registered items and their history.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <VerifiedUserIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Property Recovery
                </Typography>
                <Typography color="textSecondary">
                  Streamlined process for recovering lost or stolen property.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/verify')}
          >
            Verify Item
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;

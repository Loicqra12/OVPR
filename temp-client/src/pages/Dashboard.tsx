import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Items
              </Typography>
              {/* TODO: Add recent items list */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Verification Requests
              </Typography>
              {/* TODO: Add verification requests list */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Activity Log
              </Typography>
              {/* TODO: Add activity log */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  FormControl,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DeclareIncident = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    date: '',
    location: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Implement incident declaration logic
    console.log('Form submitted:', formData);
    navigate('/dashboard');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Report Incident
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <Select
                value={formData.type}
                onChange={handleChange}
                name="type"
                displayEmpty
                required
              >
                <MenuItem value="" disabled>Select Incident Type</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
                <MenuItem value="stolen">Stolen</MenuItem>
                <MenuItem value="damaged">Damaged</MenuItem>
              </Select>
              <FormHelperText>Select the type of incident</FormHelperText>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="date"
              label="Date of Incident"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Submit Report
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default DeclareIncident;

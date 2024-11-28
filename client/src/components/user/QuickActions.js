import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Report as ReportIcon,
  FindInPage as FindIcon,
} from '@mui/icons-material';

const QuickActions = () => {
  const theme = useTheme();

  const actions = [
    {
      title: 'Déclarer un objet perdu',
      icon: <ReportIcon />,
      color: '#f44336',
      action: () => console.log('Déclarer perdu'),
    },
    {
      title: 'Signaler un objet trouvé',
      icon: <FindIcon />,
      color: '#4caf50',
      action: () => console.log('Signaler trouvé'),
    },
    {
      title: 'Déclarer un vol',
      icon: <ReportIcon />,
      color: '#ff9800',
      action: () => console.log('Déclarer vol'),
    },
    {
      title: 'Rechercher un objet',
      icon: <SearchIcon />,
      color: '#2196f3',
      action: () => console.log('Rechercher'),
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Actions Rapides
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Button
              variant="contained"
              fullWidth
              startIcon={action.icon}
              onClick={action.action}
              sx={{
                py: 2,
                background: `linear-gradient(45deg, ${action.color} 30%, ${action.color}dd 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${action.color}dd 30%, ${action.color} 90%)`,
                },
              }}
            >
              {action.title}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Conseil : Plus vous fournissez de détails, plus les chances de retrouver votre objet sont grandes.
        </Typography>
      </Box>
    </Paper>
  );
};

export default QuickActions;

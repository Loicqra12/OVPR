import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, progress }) => {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={2}
      sx={{
        height: '100%',
        background: `linear-gradient(45deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: `${color}15`,
              display: 'flex',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" color="text.primary">
            {value}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const UserStatistics = () => {
  const theme = useTheme();

  const stats = [
    {
      title: 'Objets déclarés ce mois',
      value: '12',
      icon: <TrendingUpIcon sx={{ color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
      progress: 75,
    },
    {
      title: 'Objets retrouvés',
      value: '8',
      icon: <CheckCircleIcon sx={{ color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
      progress: 66,
    },
    {
      title: 'Temps moyen de résolution',
      value: '3.5 jours',
      icon: <AccessTimeIcon sx={{ color: theme.palette.warning.main }} />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Rayon de recherche',
      value: '5 km',
      icon: <LocationOnIcon sx={{ color: theme.palette.info.main }} />,
      color: theme.palette.info.main,
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
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <TrendingUpIcon sx={{ mr: 1 }} />
        Statistiques
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Graphiques supplémentaires peuvent être ajoutés ici */}
    </Paper>
  );
};

export default UserStatistics;

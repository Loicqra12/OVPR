import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const getAlertIcon = (severity) => {
  switch (severity) {
    case 'high':
      return <ErrorIcon color="error" />;
    case 'medium':
      return <WarningIcon color="warning" />;
    default:
      return <InfoIcon color="info" />;
  }
};

const getAlertColor = (severity) => {
  switch (severity) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    default:
      return 'info';
  }
};

const AlertsList = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Aucune alerte pour le moment
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {alerts.map((alert) => (
        <ListItem
          key={alert.id}
          sx={{
            borderLeft: 3,
            borderColor: (theme) => theme.palette[getAlertColor(alert.severity)].main,
            mb: 1,
            backgroundColor: (theme) => 
              theme.palette[getAlertColor(alert.severity)].light + '10',
            '&:hover': {
              backgroundColor: (theme) =>
                theme.palette[getAlertColor(alert.severity)].light + '20',
            },
          }}
        >
          <ListItemIcon>
            {getAlertIcon(alert.severity)}
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1">
                  {alert.title}
                </Typography>
                <Chip
                  label={alert.type}
                  size="small"
                  color={getAlertColor(alert.severity)}
                  variant="outlined"
                />
              </Box>
            }
            secondary={
              <>
                <Typography variant="body2" color="text.secondary">
                  {alert.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(alert.timestamp).toLocaleString()}
                </Typography>
              </>
            }
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" size="small">
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default AlertsList;

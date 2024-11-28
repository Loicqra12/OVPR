import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Divider,
  Paper,
  Badge,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  NotificationsActive as NotificationsActiveIcon,
  FindInPage as FindInPageIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
} from '@mui/icons-material';

// Données de test pour les notifications
const mockNotifications = [
  {
    id: 1,
    type: 'match',
    title: 'Correspondance potentielle trouvée',
    description: 'Un objet similaire à votre déclaration a été trouvé à proximité',
    time: '5 min',
    read: false,
  },
  {
    id: 2,
    type: 'status',
    title: 'Statut mis à jour',
    description: 'Votre déclaration #12345 a été marquée comme résolue',
    time: '1 heure',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'Rappel',
    description: 'N\'oubliez pas de mettre à jour vos informations de contact',
    time: '2 jours',
    read: true,
  },
];

const UserNotifications = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    handleMenuClose();
  };

  const handleDelete = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    handleMenuClose();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'match':
        return <FindInPageIcon sx={{ color: theme.palette.info.main }} />;
      case 'status':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      default:
        return <NotificationsActiveIcon sx={{ color: theme.palette.warning.main }} />;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Badge
          badgeContent={notifications.filter(n => !n.read).length}
          color="error"
          sx={{ mr: 2 }}
        >
          <NotificationsActiveIcon color="primary" />
        </Badge>
        <Typography variant="h6" color="primary">
          Notifications
        </Typography>
      </Box>

      <List sx={{ width: '100%' }}>
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                bgcolor: notification.read ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: 1,
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.paper' }}>
                  {getNotificationIcon(notification.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="text.primary"
                    sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                  >
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {notification.description}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      il y a {notification.time}
                    </Typography>
                  </React.Fragment>
                }
              />
              <IconButton
                edge="end"
                aria-label="more"
                onClick={(e) => handleMenuOpen(e, notification)}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItem>
            {index < notifications.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && !selectedNotification.read && (
          <MenuItem onClick={() => handleMarkAsRead(selectedNotification.id)}>
            <DoneIcon sx={{ mr: 1 }} />
            Marquer comme lu
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDelete(selectedNotification?.id)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {notifications.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4,
          }}
        >
          <NotificationsActiveIcon
            sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
          />
          <Typography color="text.secondary">
            Aucune notification pour le moment
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default UserNotifications;

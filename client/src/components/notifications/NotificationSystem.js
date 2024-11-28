import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  FindInPage,
  LocalOffer,
  CheckCircle,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationSystem = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Simuler la récupération des notifications depuis le serveur
    fetchNotifications();
    // Mettre en place une connexion WebSocket pour les notifications en temps réel
    setupWebSocket();

    return () => {
      // Nettoyer la connexion WebSocket lors du démontage
      cleanupWebSocket();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
      updateUnreadCount(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket('ws://localhost:5000/notifications');

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      handleNewNotification(newNotification);
    };

    // Stocker la référence WebSocket pour le nettoyage
    window.notificationWs = ws;
  };

  const cleanupWebSocket = () => {
    if (window.notificationWs) {
      window.notificationWs.close();
    }
  };

  const handleNewNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
    // Afficher une notification système si supporté
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
      });
    }
  };

  const updateUnreadCount = (notifs) => {
    const unread = notifs.filter((n) => !n.read).length;
    setUnreadCount(unread);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await fetch(`/api/notifications/${notification._id}/read`, {
          method: 'PUT',
        });
        
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => prev - 1);
      } catch (error) {
        console.error('Erreur lors du marquage de la notification:', error);
      }
    }

    handleClose();
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'match':
        return <FindInPage color="primary" />;
      case 'update':
        return <LocalOffer color="secondary" />;
      case 'resolved':
        return <CheckCircle color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: '100%',
            maxWidth: 360,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="h6" component="div">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </Typography>
          )}
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Aucune notification
            </Typography>
          </MenuItem>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.paper' }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {notification.message}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {format(
                          new Date(notification.createdAt),
                          'Pp',
                          { locale: fr }
                        )}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationSystem;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const NotificationCenter = () => {
  const [tab, setTab] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    target: 'all',
    priority: 'normal',
  });

  useEffect(() => {
    fetchNotifications();
  }, [tab]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/notifications?type=${tab === 0 ? 'system' : 'user'}`);
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNotification),
      });

      if (response.ok) {
        setOpenDialog(false);
        fetchNotifications();
        setNewNotification({
          title: '',
          message: '',
          type: 'info',
          target: 'all',
          priority: 'normal',
        });
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotifications();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckIcon color="success" />;
      case 'error':
        return <WarningIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Centre de notifications</Typography>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nouvelle notification
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="Notifications système" icon={<NotificationsIcon />} />
        <Tab label="Notifications utilisateurs" icon={<NotificationsIcon />} />
      </Tabs>

      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              mb: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
            <ListItemText
              primary={notification.title}
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      size="small"
                      label={notification.priority}
                      color={getPriorityColor(notification.priority)}
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      size="small"
                      label={notification.target}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleDeleteNotification(notification.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouvelle notification</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Titre"
            value={newNotification.title}
            onChange={(e) =>
              setNewNotification({ ...newNotification, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Message"
            value={newNotification.message}
            onChange={(e) =>
              setNewNotification({ ...newNotification, message: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={newNotification.type}
              onChange={(e) =>
                setNewNotification({ ...newNotification, type: e.target.value })
              }
              label="Type"
            >
              <MenuItem value="info">Information</MenuItem>
              <MenuItem value="warning">Avertissement</MenuItem>
              <MenuItem value="error">Erreur</MenuItem>
              <MenuItem value="success">Succès</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Cible</InputLabel>
            <Select
              value={newNotification.target}
              onChange={(e) =>
                setNewNotification({ ...newNotification, target: e.target.value })
              }
              label="Cible"
            >
              <MenuItem value="all">Tous les utilisateurs</MenuItem>
              <MenuItem value="admins">Administrateurs</MenuItem>
              <MenuItem value="moderators">Modérateurs</MenuItem>
              <MenuItem value="users">Utilisateurs standard</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Priorité</InputLabel>
            <Select
              value={newNotification.priority}
              onChange={(e) =>
                setNewNotification({ ...newNotification, priority: e.target.value })
              }
              label="Priorité"
            >
              <MenuItem value="low">Basse</MenuItem>
              <MenuItem value="normal">Normale</MenuItem>
              <MenuItem value="high">Haute</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={handleSendNotification}
            variant="contained"
            disabled={!newNotification.title || !newNotification.message}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationCenter;

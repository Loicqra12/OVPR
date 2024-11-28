import React, { useState, useEffect } from 'react';
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Box,
    Divider,
    Chip
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Compare as CompareIcon,
    Update as UpdateIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => n.status === 'unread').length);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Rafraîchir les notifications toutes les minutes
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Marquer la notification comme lue
            await axios.patch(`/api/notifications/${notification._id}/read`);
            
            // Rediriger vers l'URL d'action si elle existe
            if (notification.actionUrl) {
                navigate(notification.actionUrl);
            }
            
            // Mettre à jour l'état local
            setNotifications(notifications.map(n => 
                n._id === notification._id ? { ...n, status: 'read' } : n
            ));
            setUnreadCount(prev => prev - 1);
            
            handleClose();
        } catch (error) {
            console.error('Erreur lors du traitement de la notification:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'match':
                return <CompareIcon color="error" />;
            case 'status_update':
                return <UpdateIcon color="info" />;
            case 'alert':
                return <ErrorIcon color="warning" />;
            default:
                return <InfoIcon color="action" />;
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
                    style: {
                        maxHeight: '80vh',
                        width: '400px'
                    }
                }}
            >
                <Box p={2}>
                    <Typography variant="h6">
                        Notifications
                        {unreadCount > 0 && (
                            <Chip
                                size="small"
                                label={`${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''}`}
                                color="error"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Typography>
                </Box>
                <Divider />
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {notifications.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="Aucune notification" />
                        </ListItem>
                    ) : (
                        notifications.map((notification) => (
                            <React.Fragment key={notification._id}>
                                <ListItem
                                    button
                                    onClick={() => handleNotificationClick(notification)}
                                    sx={{
                                        backgroundColor: notification.status === 'unread' 
                                            ? 'action.hover' 
                                            : 'inherit'
                                    }}
                                >
                                    <ListItemIcon>
                                        {getNotificationIcon(notification.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center">
                                                <Typography variant="subtitle2">
                                                    {notification.title}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={notification.priority}
                                                    color={getPriorityColor(notification.priority)}
                                                    sx={{ ml: 1 }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {notification.message}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    display="block"
                                                    color="text.secondary"
                                                >
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Menu>
        </>
    );
};

export default NotificationCenter;

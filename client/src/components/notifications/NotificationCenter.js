import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Box,
  Badge,
  Divider,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Avatar,
  Menu,
  MenuItem,
  Fade,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  CheckCircle as ReadIcon,
  RadioButtonUnchecked as UnreadIcon,
  MoreVert as MoreIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationCenter = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    emailAddress: '',
    phoneNumber: '',
  });

  // Simuler le chargement des notifications et messages
  useEffect(() => {
    // Mock notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'match',
        priority: 'high',
        title: 'Correspondance trouvée',
        message: 'Un objet similaire à votre déclaration a été trouvé',
        date: new Date(),
        read: false,
      },
      {
        id: 2,
        type: 'update',
        priority: 'medium',
        title: 'Mise à jour de statut',
        message: 'Votre objet a été marqué comme "En cours de vérification"',
        date: new Date(Date.now() - 86400000),
        read: true,
      },
    ];

    // Mock messages
    const mockMessages = [
      {
        id: 1,
        sender: {
          id: 1,
          name: 'Jean Dupont',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
        conversation: [
          {
            id: 1,
            text: 'Bonjour, j\'ai trouvé votre objet',
            date: new Date(),
            senderId: 1,
          }
        ],
        read: false,
        date: new Date(),
      },
      {
        id: 2,
        sender: {
          id: 2,
          name: 'Marie Martin',
          avatar: 'https://i.pravatar.cc/150?img=2',
        },
        conversation: [
          {
            id: 1,
            text: 'Est-ce que l\'objet est toujours disponible ?',
            date: new Date(Date.now() - 172800000),
            senderId: 2,
          }
        ],
        read: true,
        date: new Date(Date.now() - 172800000),
      },
    ];

    setNotifications(mockNotifications);
    setMessages(mockMessages);
    setUnreadNotifications(mockNotifications.filter(n => !n.read).length);
    setUnreadMessages(mockMessages.filter(m => !m.read).length);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleNotificationClick = (notification) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    setUnreadNotifications(prev => Math.max(0, prev - 1));
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setMessageDialogOpen(true);
    if (!message.read) {
      setMessages(prev =>
        prev.map(m =>
          m.id === message.id ? { ...m, read: true } : m
        )
      );
      setUnreadMessages(prev => Math.max(0, prev - 1));
    }
  };

  const handleContextMenu = (event, item, type) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
    setSelectedItem({ item, type });
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
    setSelectedItem(null);
  };

  const handleMarkAsRead = () => {
    if (selectedItem.type === 'notification') {
      handleNotificationClick(selectedItem.item);
    } else {
      handleMessageClick(selectedItem.item);
    }
    handleContextMenuClose();
  };

  const handleDelete = () => {
    if (selectedItem.type === 'notification') {
      setNotifications(prev => prev.filter(n => n.id !== selectedItem.item.id));
    } else {
      setMessages(prev => prev.filter(m => m.id !== selectedItem.item.id));
    }
    handleContextMenuClose();
  };

  const handleReply = () => {
    if (!replyText.trim()) return;

    setMessages(prev =>
      prev.map(m => {
        if (m.id === selectedMessage.id) {
          return {
            ...m,
            conversation: [
              ...m.conversation,
              {
                id: m.conversation.length + 1,
                text: replyText,
                date: new Date(),
                senderId: 'current-user',
              },
            ],
          };
        }
        return m;
      })
    );

    setReplyText('');
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadNotifications(0);
  };

  const handleSettingsSave = () => {
    // Sauvegarder les paramètres
    // À implémenter avec l'API
    console.log('Saving settings:', settings);
    setSettingsOpen(false);
  };

  const NotificationBadge = () => (
    <Badge badgeContent={unreadNotifications} color="error">
      <NotificationsIcon />
    </Badge>
  );

  const MessageBadge = () => (
    <Badge badgeContent={unreadMessages} color="error">
      <NotificationsIcon />
    </Badge>
  );

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <NotificationBadge />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            {t('notifications.title')}
          </Typography>
          <Box>
            <IconButton onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider />

        <Tabs value={currentTab} onChange={handleTabChange} sx={{ px: 2 }}>
          <Tab label={t('notifications.notifications')} />
          <Tab label={t('notifications.messages')} />
        </Tabs>

        {currentTab === 0 ? (
          notifications.length > 0 ? (
            <>
              <List>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    button
                    onClick={() => handleNotificationClick(notification)}
                    onContextMenu={(e) => handleContextMenu(e, notification, 'notification')}
                    sx={{
                      backgroundColor: notification.read ? 'inherit' : 'action.hover',
                    }}
                  >
                    <ListItemIcon>
                      {notification.read ? <ReadIcon /> : <UnreadIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(notification.date, 'dd MMMM yyyy', { locale: fr })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleClearAll}
                >
                  {t('notifications.clearAll')}
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {t('notifications.noNotifications')}
              </Typography>
            </Box>
          )
        ) : (
          messages.length > 0 ? (
            <>
              <List>
                {messages.map((message) => (
                  <ListItem
                    key={message.id}
                    button
                    onClick={() => handleMessageClick(message)}
                    onContextMenu={(e) => handleContextMenu(e, message, 'message')}
                    sx={{
                      backgroundColor: message.read ? 'inherit' : 'action.hover',
                    }}
                  >
                    <ListItemIcon>
                      <Avatar src={message.sender.avatar} sx={{ width: 24, height: 24 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={message.sender.name}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {message.conversation[0].text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(message.date, 'dd MMMM yyyy', { locale: fr })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {t('notifications.noMessages')}
              </Typography>
            </Box>
          )
        )}

        {contextMenu && (
          <Menu
            open={true}
            onClose={handleContextMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={{
              top: contextMenu.y,
              left: contextMenu.x,
            }}
          >
            <MenuItem onClick={handleMarkAsRead}>
              {t('notifications.markAsRead')}
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              {t('notifications.delete')}
            </MenuItem>
          </Menu>
        )}
      </Drawer>

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>{t('notifications.settings')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.checked })}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1 }} />
                  {t('notifications.emailNotifications')}
                </Box>
              }
            />
            {settings.email && (
              <TextField
                fullWidth
                margin="dense"
                label={t('notifications.emailAddress')}
                type="email"
                value={settings.emailAddress}
                onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
              />
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.sms}
                  onChange={(e) => setSettings({ ...settings, sms: e.target.checked })}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SmsIcon sx={{ mr: 1 }} />
                  {t('notifications.smsNotifications')}
                </Box>
              }
            />
            {settings.sms && (
              <TextField
                fullWidth
                margin="dense"
                label={t('notifications.phoneNumber')}
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSettingsSave} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)}>
        <DialogTitle>
          {selectedMessage.sender.name}
        </DialogTitle>
        <DialogContent>
          {selectedMessage.conversation.map((message) => (
            <Box key={message.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={selectedMessage.sender.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {message.text}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {format(message.date, 'dd MMMM yyyy', { locale: fr })}
              </Typography>
            </Box>
          ))}
          <TextField
            fullWidth
            margin="dense"
            label={t('notifications.reply')}
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleReply} variant="contained">
            {t('notifications.reply')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationCenter;

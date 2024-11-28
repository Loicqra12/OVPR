import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Drawer,
  Divider,
  ListItemAvatar,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  // Simuler la liste des utilisateurs avec des conversations
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: "Jean Dupont",
        unread: 2,
        lastMessage: "J'ai perdu mon téléphone...",
        lastMessageTime: new Date(Date.now() - 1800000),
      },
      {
        id: 2,
        name: "Marie Martin",
        unread: 0,
        lastMessage: "Merci pour votre aide",
        lastMessageTime: new Date(Date.now() - 3600000),
      },
    ];
    setUsers(mockUsers);

    // Simuler les messages pour chaque utilisateur
    const mockMessages = {
      1: [
        {
          id: 1,
          text: "Bonjour, j'ai perdu mon téléphone hier soir",
          sender: "user",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 2,
          text: "Je peux vous aider à le retrouver. Pouvez-vous me donner plus de détails ?",
          sender: "admin",
          timestamp: new Date(Date.now() - 3300000),
        },
      ],
      2: [
        {
          id: 1,
          text: "J'ai trouvé un sac à main",
          sender: "user",
          timestamp: new Date(Date.now() - 7200000),
        },
      ],
    };
    setMessages(mockMessages);
  }, []);

  const handleSend = () => {
    if (message.trim() && selectedUser) {
      const newMessage = {
        id: (messages[selectedUser.id]?.length || 0) + 1,
        text: message,
        sender: "admin",
        timestamp: new Date(),
      };
      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
      }));
      setMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Liste des utilisateurs */}
      <Paper sx={{ width: 320, borderRight: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Conversations
        </Typography>
        <Divider />
        <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
          {users.map((user) => (
            <ListItem
              key={user.id}
              button
              selected={selectedUser?.id === user.id}
              onClick={() => setSelectedUser(user)}
            >
              <ListItemAvatar>
                <Badge
                  badgeContent={user.unread}
                  color="error"
                  invisible={user.unread === 0}
                >
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{
                        display: 'inline',
                        maxWidth: '70%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.lastMessage}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      {format(user.lastMessageTime, 'PPp', { locale: fr })}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Zone de chat */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">{selectedUser.name}</Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              <List>
                {messages[selectedUser.id]?.map((msg) => (
                  <ListItem
                    key={msg.id}
                    sx={{
                      flexDirection: 'column',
                      alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
                      {msg.sender === 'user' && (
                        <Avatar sx={{ mr: 1 }}>
                          <PersonIcon />
                        </Avatar>
                      )}
                      <Paper
                        sx={{
                          p: 1,
                          backgroundColor: msg.sender === 'admin' ? 'primary.main' : 'grey.100',
                          color: msg.sender === 'admin' ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body1">{msg.text}</Typography>
                      </Paper>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ mt: 0.5, color: 'text.secondary' }}
                    >
                      {format(msg.timestamp, 'PPp', { locale: fr })}
                    </Typography>
                  </ListItem>
                ))}
                <div ref={messagesEndRef} />
              </List>
            </Box>

            <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Écrivez votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSend();
                    }
                  }}
                  sx={{ mr: 1 }}
                />
                <IconButton color="primary" onClick={handleSend}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Sélectionnez une conversation pour commencer
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminChat;

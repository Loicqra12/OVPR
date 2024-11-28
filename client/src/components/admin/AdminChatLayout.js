import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  IconButton,
  Button,
  Chip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const mockUsers = [
  { id: 1, name: 'Jean Dupont', lastMessage: 'J\'ai perdu mes clés...', unread: 2 },
  { id: 2, name: 'Marie Martin', lastMessage: 'Merci pour votre aide !', unread: 0 },
  { id: 3, name: 'Pierre Durand', lastMessage: 'Où puis-je récupérer...', unread: 1 },
];

const AdminChatLayout = () => {
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      // Simuler le chargement des messages pour l'utilisateur sélectionné
      const mockMessages = [
        {
          id: 1,
          text: "Bonjour, j'ai perdu mes clés hier soir près de la bibliothèque.",
          sender: "user",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 2,
          text: "Je comprends votre situation. Pouvez-vous me donner plus de détails sur vos clés ?",
          sender: "bot",
          timestamp: new Date(Date.now() - 3500000),
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedUser]);

  const handleSend = async () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "admin",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      if (useAI) {
        setIsTyping(true);
        // Simuler une réponse de l'IA
        setTimeout(() => {
          const aiSuggestion = {
            id: messages.length + 2,
            text: generateAIResponse(message),
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiSuggestion]);
          setIsTyping(false);
        }, 1500);
      }
    }
  };

  const generateAIResponse = (adminMessage) => {
    const suggestions = [
      "D'après les informations disponibles, des clés correspondant à cette description ont été trouvées hier soir. Je suggère de vérifier au bureau des objets trouvés.",
      "Je recommande de créer une alerte pour ce type d'objet. Voulez-vous que je m'en occupe ?",
      "Les statistiques montrent que 80% des objets perdus dans cette zone sont retrouvés dans les 48 heures.",
      "Je peux lancer une recherche automatique dans notre base de données d'objets trouvés. Souhaitez-vous que je procède ?",
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const getSenderAvatar = (sender) => {
    switch (sender) {
      case 'bot':
        return <BotIcon />;
      case 'admin':
        return <AdminIcon />;
      case 'user':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getSenderColor = (sender) => {
    switch (sender) {
      case 'bot':
        return theme.palette.info.main;
      case 'admin':
        return theme.palette.primary.main;
      case 'user':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* Liste des utilisateurs */}
      <Paper sx={{ width: 320, borderRight: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main, color: 'white' }}>
          <Typography variant="h6">Conversations</Typography>
        </Box>
        <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
          {mockUsers.map((user) => (
            <React.Fragment key={user.id}>
              <ListItem
                button
                selected={selectedUser?.id === user.id}
                onClick={() => setSelectedUser(user)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.lastMessage}
                  primaryTypographyProps={{
                    fontWeight: user.unread > 0 ? 'bold' : 'normal',
                  }}
                />
                {user.unread > 0 && (
                  <Chip
                    label={user.unread}
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Zone de chat */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedUser.name}</Typography>
              <Button
                variant="contained"
                color="info"
                startIcon={<AIIcon />}
                onClick={() => setUseAI(!useAI)}
                sx={{
                  backgroundColor: useAI ? theme.palette.success.main : theme.palette.grey[500],
                  '&:hover': {
                    backgroundColor: useAI ? theme.palette.success.dark : theme.palette.grey[700],
                  },
                }}
              >
                Assistant IA {useAI ? 'Activé' : 'Désactivé'}
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, backgroundColor: theme.palette.background.default }}>
              <List>
                {messages.map((msg) => (
                  <ListItem
                    key={msg.id}
                    sx={{
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                      mb: 2,
                    }}
                  >
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: msg.sender === 'user' ? 'row' : 'row-reverse',
                      maxWidth: '80%',
                    }}>
                      <Avatar
                        sx={{
                          bgcolor: getSenderColor(msg.sender),
                          mx: 1,
                        }}
                      >
                        {getSenderAvatar(msg.sender)}
                      </Avatar>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 1.5,
                          backgroundColor: msg.sender === 'user' ? theme.palette.background.paper : theme.palette.primary.main,
                          color: msg.sender === 'user' ? 'text.primary' : 'white',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body1">{msg.text}</Typography>
                      </Paper>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        color: 'text.secondary',
                        alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                        mx: 7,
                      }}
                    >
                      {format(msg.timestamp, 'PPp', { locale: fr })}
                    </Typography>
                  </ListItem>
                ))}
                {isTyping && (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: 2 }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      L'assistant IA analyse...
                    </Typography>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </List>
            </Box>
            <Divider />
            <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
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
                  sx={{
                    mr: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
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
              backgroundColor: theme.palette.background.default,
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

export default AdminChatLayout;

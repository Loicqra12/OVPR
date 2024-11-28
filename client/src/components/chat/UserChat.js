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
  Fab,
  Drawer,
  Badge,
  Chip,
  Divider,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const UserChat = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simuler la réception de messages initiaux
  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        text: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
        sender: "bot",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: 2,
        text: "Je peux vous aider à :",
        sender: "bot",
        timestamp: new Date(Date.now() - 3599000),
        suggestions: [
          "Déclarer un objet perdu",
          "Rechercher un objet",
          "Contacter un administrateur",
          "Consulter mes déclarations"
        ]
      },
    ];
    setMessages(initialMessages);
  }, []);

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);

      // Simuler une réponse de l'IA après un délai
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: generateBotResponse(message),
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const generateBotResponse = (userMessage) => {
    const responses = [
      "Je comprends votre demande. Un administrateur va vous répondre rapidement.",
      "Pouvez-vous me donner plus de détails sur votre objet perdu ?",
      "Je peux vous aider à remplir une déclaration. Voulez-vous commencer ?",
      "Avez-vous déjà consulté notre carte des objets trouvés ?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestionClick = (suggestion) => {
    const userMessage = {
      id: messages.length + 1,
      text: suggestion,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Simuler la réponse
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateBotResponse(suggestion),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getSenderAvatar = (sender) => {
    switch (sender) {
      case 'bot':
        return <BotIcon />;
      case 'admin':
        return <AdminIcon />;
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
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
        onClick={() => {
          setOpen(true);
          setUnreadCount(0);
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <ChatIcon />
        </Badge>
      </Fab>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={{ width: 360, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{
            p: 2,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6">Support OVPR</Typography>
            <IconButton color="inherit" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, backgroundColor: theme.palette.background.default }}>
            <List>
              {messages.map((msg) => (
                <ListItem
                  key={msg.id}
                  sx={{
                    flexDirection: 'column',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
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
                        backgroundColor: msg.sender === 'user' ? theme.palette.primary.main : theme.palette.background.paper,
                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1">{msg.text}</Typography>
                      {msg.suggestions && (
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {msg.suggestions.map((suggestion, index) => (
                            <Chip
                              key={index}
                              label={suggestion}
                              onClick={() => handleSuggestionClick(suggestion)}
                              sx={{
                                backgroundColor: theme.palette.primary.light,
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: theme.palette.primary.main,
                                },
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Paper>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      color: 'text.secondary',
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
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
                    L'assistant écrit...
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
        </Box>
      </Drawer>
    </>
  );
};

export default UserChat;

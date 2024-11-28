import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  CircularProgress,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const mockChats = [
  {
    id: 1,
    user: {
      id: 2,
      name: 'Jean Kouassi',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    lastMessage: 'Bonjour, j\'ai trouvé votre téléphone',
    timestamp: new Date(),
    unread: 2
  },
  {
    id: 2,
    user: {
      id: 3,
      name: 'Marie Koné',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    lastMessage: 'Merci beaucoup pour votre aide',
    timestamp: new Date(Date.now() - 86400000),
    unread: 0
  }
];

const mockMessages = [
  {
    id: 1,
    senderId: 1,
    text: 'Bonjour, j\'ai perdu mon téléphone hier',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: 2,
    senderId: 2,
    text: 'Bonjour, j\'ai trouvé un téléphone près du marché',
    timestamp: new Date(Date.now() - 3500000)
  },
  {
    id: 3,
    senderId: 1,
    text: 'C\'est un iPhone noir avec une coque rouge',
    timestamp: new Date(Date.now() - 3400000)
  }
];

const ChatSystem = () => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState(mockChats);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) {
      setLoading(true);
      // Simuler le chargement des messages
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
        scrollToBottom();
      }, 1000);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      senderId: 1, // ID de l'utilisateur actuel
      text: message,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: fr });
  };

  return (
    <Paper elevation={3} sx={{ height: '80vh', display: 'flex' }}>
      {/* Liste des conversations */}
      <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          {t('chat.conversations')}
        </Typography>
        <List sx={{ overflow: 'auto', maxHeight: 'calc(80vh - 64px)' }}>
          {chats.map((chat) => (
            <React.Fragment key={chat.id}>
              <ListItem
                button
                selected={selectedChat?.id === chat.id}
                onClick={() => setSelectedChat(chat)}
              >
                <ListItemAvatar>
                  <Badge
                    badgeContent={chat.unread}
                    color="primary"
                    invisible={!chat.unread}
                  >
                    <Avatar src={chat.user.avatar} alt={chat.user.name} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.user.name}
                  secondary={chat.lastMessage}
                  secondaryTypographyProps={{
                    noWrap: true,
                    style: { width: '180px' }
                  }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Zone de chat */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            {/* En-tête du chat */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">
                {selectedChat.user.name}
              </Typography>
            </Box>

            {/* Messages */}
            <Box sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : (
                messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: msg.senderId === 1 ? 'flex-end' : 'flex-start',
                      maxWidth: '70%'
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        backgroundColor: msg.senderId === 1 ? 'primary.main' : 'grey.100',
                        color: msg.senderId === 1 ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body1">
                        {msg.text}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {formatDate(msg.timestamp)}
                      </Typography>
                    </Paper>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Zone de saisie */}
            <Box
              component="form"
              onSubmit={handleSendMessage}
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                display: 'flex',
                gap: 1
              }}
            >
              <IconButton size="small">
                <AttachFileIcon />
              </IconButton>
              <TextField
                fullWidth
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('chat.typemessage')}
                variant="outlined"
              />
              <IconButton
                color="primary"
                type="submit"
                disabled={!message.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            gap={2}
          >
            <Typography variant="h6" color="text.secondary">
              {t('chat.select_conversation')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setSelectedChat(chats[0])}
            >
              {t('chat.start_chat')}
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ChatSystem;

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Badge,
  Divider,
  Menu,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  Block as BlockIcon,
  Flag as FlagIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const Chat = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // TODO: Charger les conversations depuis l'API
    const fetchConversations = async () => {
      // Simulation de données
      const mockConversations = [
        {
          id: 1,
          user: { id: 2, name: 'Jean Dupont', avatar: null },
          lastMessage: 'Bonjour, est-ce toujours disponible ?',
          unread: 2,
          timestamp: new Date(),
          itemId: 'item123',
          itemTitle: 'iPhone perdu',
        },
        // Ajouter plus de conversations simulées ici
      ];
      setConversations(mockConversations);
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    // TODO: Charger les messages de la conversation sélectionnée
    if (selectedConversation && currentUser) {
      const fetchMessages = async () => {
        // Simulation de données
        const mockMessages = [
          {
            id: 1,
            senderId: currentUser.uid,
            text: 'Bonjour, j\'ai trouvé votre téléphone',
            timestamp: new Date(Date.now() - 86400000),
          },
          {
            id: 2,
            senderId: 2,
            text: 'Merci beaucoup ! Où puis-je le récupérer ?',
            timestamp: new Date(),
          },
        ];
        setMessages(mockMessages);
        scrollToBottom();
      };

      fetchMessages();
    }
  }, [selectedConversation, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    // TODO: Envoyer le message via l'API
    const message = {
      id: Date.now(),
      senderId: currentUser.uid,
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    scrollToBottom();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBlock = () => {
    // TODO: Implémenter le blocage d'utilisateur
    handleMenuClose();
  };

  const handleReport = () => {
    // TODO: Implémenter le signalement
    handleMenuClose();
  };

  const handleDelete = () => {
    // TODO: Implémenter la suppression de conversation
    handleMenuClose();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {!currentUser ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 200px)',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Veuillez vous connecter pour accéder à la messagerie
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Liste des conversations */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
              <Box p={2}>
                <TextField
                  fullWidth
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Divider />
              <List sx={{ overflow: 'auto', height: 'calc(100% - 80px)' }}>
                {conversations.map((conversation) => (
                  <ListItem
                    key={conversation.id}
                    button
                    selected={selectedConversation?.id === conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={conversation.unread}
                        color="primary"
                        invisible={!conversation.unread}
                      >
                        <Avatar src={conversation.user.avatar} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={conversation.user.name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {conversation.itemTitle}
                          </Typography>
                          {" — " + conversation.lastMessage}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Zone de conversation */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
              {selectedConversation ? (
                <>
                  {/* En-tête de la conversation */}
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={selectedConversation.user.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="h6">
                          {selectedConversation.user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConversation.itemTitle}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={handleMenuOpen}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleBlock}>
                        <BlockIcon sx={{ mr: 1 }} /> Bloquer l'utilisateur
                      </MenuItem>
                      <MenuItem onClick={handleReport}>
                        <FlagIcon sx={{ mr: 1 }} /> Signaler
                      </MenuItem>
                      <MenuItem onClick={handleDelete}>
                        <DeleteIcon sx={{ mr: 1 }} /> Supprimer la conversation
                      </MenuItem>
                    </Menu>
                  </Box>

                  {/* Messages */}
                  <Box
                    sx={{
                      p: 2,
                      height: 'calc(100% - 160px)',
                      overflow: 'auto',
                    }}
                  >
                    {messages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent:
                            message.senderId === currentUser.uid
                              ? 'flex-end'
                              : 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            bgcolor:
                              message.senderId === currentUser.uid
                                ? 'primary.main'
                                : 'grey.100',
                            color:
                              message.senderId === currentUser.uid
                                ? 'white'
                                : 'text.primary',
                          }}
                        >
                          <Typography variant="body1">{message.text}</Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              color:
                                message.senderId === currentUser.uid
                                  ? 'rgba(255, 255, 255, 0.7)'
                                  : 'text.secondary',
                            }}
                          >
                            {formatDistanceToNow(message.timestamp, {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
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
                      alignItems: 'center',
                    }}
                  >
                    <IconButton size="small" sx={{ mr: 1 }}>
                      <AttachFileIcon />
                    </IconButton>
                    <TextField
                      fullWidth
                      placeholder="Écrivez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      multiline
                      maxRows={4}
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      color="primary"
                      type="submit"
                      disabled={!newMessage.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Sélectionnez une conversation pour commencer
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Chat;

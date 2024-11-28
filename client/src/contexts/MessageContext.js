import React, { createContext, useContext, useState, useEffect } from 'react';
import messagesApi from '../api/messages';
import { useAuth } from './AuthContext';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages doit être utilisé à l\'intérieur d\'un MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les conversations initiales
  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  // Fonction pour récupérer les conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messagesApi.getConversations();
      setConversations(data.conversations);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setError('Erreur lors du chargement des conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle conversation
  const createConversation = async (recipientId, itemId, initialMessage) => {
    try {
      const newConversation = await messagesApi.createConversation(
        recipientId,
        itemId,
        initialMessage
      );
      setConversations([newConversation, ...conversations]);
      return newConversation;
    } catch (err) {
      setError('Erreur lors de la création de la conversation');
      throw err;
    }
  };

  // Envoyer un message
  const sendMessage = async (conversationId, message) => {
    try {
      const newMessage = await messagesApi.sendMessage(conversationId, message);
      // Mettre à jour la conversation localement
      setConversations(conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: message.text,
            timestamp: new Date(),
          };
        }
        return conv;
      }));
      return newMessage;
    } catch (err) {
      setError('Erreur lors de l\'envoi du message');
      throw err;
    }
  };

  // Marquer une conversation comme lue
  const markConversationAsRead = async (conversationId) => {
    try {
      await messagesApi.markAsRead(conversationId);
      setConversations(conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unread: 0 };
        }
        return conv;
      }));
      updateUnreadCount();
    } catch (err) {
      setError('Erreur lors du marquage comme lu');
      throw err;
    }
  };

  // Mettre à jour le compteur de messages non lus
  const updateUnreadCount = () => {
    const count = conversations.reduce((acc, conv) => acc + (conv.unread || 0), 0);
    setUnreadCount(count);
  };

  // Bloquer un utilisateur
  const blockUser = async (userId) => {
    try {
      await messagesApi.blockUser(userId);
      // Mettre à jour la liste des conversations pour refléter le blocage
      setConversations(conversations.filter(conv => conv.user.id !== userId));
    } catch (err) {
      setError('Erreur lors du blocage de l\'utilisateur');
      throw err;
    }
  };

  // Signaler un message
  const reportMessage = async (messageId, reason) => {
    try {
      await messagesApi.reportMessage(messageId, reason);
    } catch (err) {
      setError('Erreur lors du signalement du message');
      throw err;
    }
  };

  // Supprimer une conversation
  const deleteConversation = async (conversationId) => {
    try {
      await messagesApi.deleteConversation(conversationId);
      setConversations(conversations.filter(conv => conv.id !== conversationId));
    } catch (err) {
      setError('Erreur lors de la suppression de la conversation');
      throw err;
    }
  };

  // Rechercher dans les messages
  const searchMessages = async (query) => {
    try {
      const results = await messagesApi.searchMessages(query);
      return results;
    } catch (err) {
      setError('Erreur lors de la recherche dans les messages');
      throw err;
    }
  };

  // Mettre à jour les préférences de notification
  const updateNotificationPreferences = async (preferences) => {
    try {
      await messagesApi.updateNotificationPreferences(preferences);
    } catch (err) {
      setError('Erreur lors de la mise à jour des préférences');
      throw err;
    }
  };

  const value = {
    conversations,
    unreadCount,
    loading,
    error,
    createConversation,
    sendMessage,
    markConversationAsRead,
    blockUser,
    reportMessage,
    deleteConversation,
    searchMessages,
    updateNotificationPreferences,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;

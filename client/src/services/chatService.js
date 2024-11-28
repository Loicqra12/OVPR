// Simuler une base de données de messages
let messages = {};
let conversations = new Set();

export const chatService = {
  // Envoyer un message
  sendMessage: async (senderId, receiverId, text) => {
    const messageId = Date.now();
    const message = {
      id: messageId,
      senderId,
      receiverId,
      text,
      timestamp: new Date(),
      read: false,
    };

    if (!messages[receiverId]) {
      messages[receiverId] = [];
    }
    messages[receiverId].push(message);
    conversations.add(receiverId);

    return message;
  },

  // Récupérer les messages d'une conversation
  getMessages: async (userId) => {
    return messages[userId] || [];
  },

  // Marquer les messages comme lus
  markAsRead: async (userId) => {
    if (messages[userId]) {
      messages[userId] = messages[userId].map(msg => ({
        ...msg,
        read: true,
      }));
    }
  },

  // Obtenir le nombre de messages non lus
  getUnreadCount: async (userId) => {
    if (!messages[userId]) return 0;
    return messages[userId].filter(msg => !msg.read).length;
  },

  // Obtenir la liste des conversations
  getConversations: async () => {
    return Array.from(conversations);
  },
};

// Simuler des webhooks pour les mises à jour en temps réel
export const chatWebhooks = {
  onMessageReceived: null,
  onMessageRead: null,
  onConversationUpdated: null,
};

// Fonction pour simuler la réception d'un nouveau message
export const simulateIncomingMessage = (senderId, receiverId, text) => {
  const message = {
    id: Date.now(),
    senderId,
    receiverId,
    text,
    timestamp: new Date(),
    read: false,
  };

  if (!messages[receiverId]) {
    messages[receiverId] = [];
  }
  messages[receiverId].push(message);

  if (chatWebhooks.onMessageReceived) {
    chatWebhooks.onMessageReceived(message);
  }
};

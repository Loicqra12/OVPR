import mockUsers from '../data/mockUsers';

// Simuler un délai de réponse
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Validation des données
const validateCredentials = (credentials) => {
  if (!credentials.email || !credentials.password) {
    throw new Error('Email et mot de passe requis');
  }
  if (!credentials.email.includes('@')) {
    throw new Error('Format d\'email invalide');
  }
  if (credentials.password.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }
};

export const mockApi = {
  // Authentification admin
  adminLogin: async (credentials) => {
    await delay(500);

    try {
      validateCredentials(credentials);

      const admin = mockUsers.find(
        (user) =>
          user.email === credentials.email &&
          user.password === credentials.password &&
          user.role === 'admin'
      );

      if (!admin) {
        throw new Error('Identifiants invalides');
      }

      return {
        token: 'mock-jwt-token',
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      };
    } catch (error) {
      throw new Error(`Erreur d'authentification: ${error.message}`);
    }
  },

  // Vérification du token admin
  verifyAdminToken: async (token) => {
    await delay(300);
    if (!token) {
      throw new Error('Token manquant');
    }
    return true;
  },

  // Statistiques pour le tableau de bord
  getAdminStats: async () => {
    await delay(500);
    return {
      totalUsers: 156,
      totalAnnounces: 324,
      resolvedAnnounces: 89,
      totalReports: 12,
      announcesByType: [
        { name: 'Perdus', value: 145 },
        { name: 'Trouvés', value: 132 },
        { name: 'Volés', value: 47 },
      ],
      userActivity: [
        { date: '2024-01-01', newUsers: 12, newAnnounces: 15 },
        { date: '2024-01-02', newUsers: 8, newAnnounces: 12 },
        { date: '2024-01-03', newUsers: 15, newAnnounces: 18 },
        { date: '2024-01-04', newUsers: 10, newAnnounces: 14 },
        { date: '2024-01-05', newUsers: 13, newAnnounces: 16 },
      ],
      monthlyStats: [
        { month: 'Jan', lost: 45, found: 38, stolen: 12 },
        { month: 'Fév', lost: 52, found: 45, stolen: 15 },
        { month: 'Mar', lost: 48, found: 42, stolen: 10 },
        { month: 'Avr', lost: 55, found: 48, stolen: 18 },
      ],
    };
  },

  // Liste des utilisateurs
  getUsers: async (page = 1, limit = 10) => {
    await delay(500);
    
    if (page < 1) {
      throw new Error('Le numéro de page doit être supérieur à 0');
    }
    if (limit < 1 || limit > 100) {
      throw new Error('La limite doit être comprise entre 1 et 100');
    }

    try {
      return {
        users: mockUsers.slice((page - 1) * limit, page * limit),
        total: mockUsers.length,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }
  },

  // Liste des annonces
  getAnnounces: async (page = 1, limit = 10) => {
    await delay(500);
    const mockAnnounces = [
      {
        _id: '1',
        title: 'iPhone perdu',
        type: 'lost',
        status: 'active',
        owner: mockUsers[0],
        createdAt: '2024-01-15',
        reports: [],
      },
      {
        _id: '2',
        title: 'Sac trouvé',
        type: 'found',
        status: 'active',
        owner: mockUsers[1],
        createdAt: '2024-01-16',
        reports: [{ reason: 'spam' }],
      },
    ];

    return {
      announces: mockAnnounces,
      total: mockAnnounces.length,
      page,
      limit,
    };
  },

  // Paramètres du système
  getSettings: async () => {
    await delay(500);
    return {
      siteName: 'OVPR',
      contactEmail: 'contact@ovpr.fr',
      supportPhone: '+33 1 23 45 67 89',
      enableRegistration: true,
      enableNotifications: true,
      moderationRequired: false,
      maxImagesPerAnnounce: 5,
      announceDuration: 30,
      maintenanceMode: false,
    };
  },

  updateSettings: async (settings) => {
    await delay(500);
    return settings;
  },
};

// Intercepter les appels fetch pour les rediriger vers notre mock API
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  // Handle admin routes
  if (url.startsWith('/api/admin')) {
    const endpoint = url.replace('/api/admin/', '');
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : undefined;

    switch (method) {
      case 'GET':
        return handleGet(endpoint);
      case 'POST':
        return handlePost(endpoint, body);
      case 'PUT':
        return handlePut(endpoint, body);
      case 'DELETE':
        return handleDelete(endpoint);
      default:
        return Promise.reject(new Error(`Méthode HTTP non supportée: ${method}`));
    }
  }

  // Handle auth routes
  if (url.startsWith('/api/auth')) {
    const endpoint = url.replace('/api/auth/', '');
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : undefined;

    switch (method) {
      case 'POST':
        const user = mockUsers.find(
          (u) => u.email === body.email && u.password === body.password
        );
        
        if (user) {
          return new Response(JSON.stringify({
            token: 'mock-user-jwt-token',
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({
            message: 'Email ou mot de passe incorrect'
          }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

      case 'GET':
        const token = options.headers?.Authorization?.split(' ')[1];
        if (token === 'mock-user-jwt-token') {
          const mockUser = mockUsers[0]; // Using first mock user for demo
          return new Response(JSON.stringify({
            id: mockUser.id,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email,
            role: mockUser.role
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({
            message: 'Token invalide'
          }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
    }
  }

  // If no mock route matches, pass through to original fetch
  return originalFetch(url, options);
};

const handleGet = async (endpoint) => {
  switch (endpoint) {
    case 'verify':
      return new Response(JSON.stringify({ valid: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    case 'stats':
      return new Response(JSON.stringify(await mockApi.getAdminStats()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    case 'users':
      return new Response(JSON.stringify(await mockApi.getUsers()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    case 'announces':
      return new Response(JSON.stringify(await mockApi.getAnnounces()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    case 'settings':
      return new Response(JSON.stringify(await mockApi.getSettings()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    default:
      return Promise.reject(new Error(`Endpoint non supporté: ${endpoint}`));
  }
};

const handlePost = async (endpoint, body) => {
  switch (endpoint) {
    case 'login':
      return new Response(JSON.stringify(await mockApi.adminLogin(body)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    default:
      return Promise.reject(new Error(`Endpoint non supporté: ${endpoint}`));
  }
};

const handlePut = async (endpoint, body) => {
  switch (endpoint) {
    case 'settings':
      return new Response(JSON.stringify(await mockApi.updateSettings(body)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    default:
      return Promise.reject(new Error(`Endpoint non supporté: ${endpoint}`));
  }
};

const handleDelete = async (endpoint) => {
  // Pas de suppression pour le moment
  return Promise.reject(new Error(`Endpoint non supporté: ${endpoint}`));
};

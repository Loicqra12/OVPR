const mockUsers = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-02-20',
  },
  {
    id: 3,
    name: 'Admin OVPR',
    email: 'admin@ovpr.fr',
    password: 'admin123!', // À ne pas utiliser en production !
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-01',
  },
];

export const getCurrentUser = () => {
  // Pour les tests, on retourne l'utilisateur admin
  return mockUsers[2];
};

export const getUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};

export default mockUsers;

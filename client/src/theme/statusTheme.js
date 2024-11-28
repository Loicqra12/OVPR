// Définition des couleurs pour chaque statut
export const STATUS_COLORS = {
  vole: {
    main: '#FF3B30', // Rouge
    light: '#FF6B60',
    dark: '#CC2F26',
    contrastText: '#FFFFFF'
  },
  perdu: {
    main: '#007AFF', // Bleu
    light: '#3395FF',
    dark: '#0062CC',
    contrastText: '#FFFFFF'
  },
  oublie: {
    main: '#FF9500', // Orange
    light: '#FFAA33',
    dark: '#CC7700',
    contrastText: '#FFFFFF'
  },
  trouve: {
    main: '#2e7d32', // Vert
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff'
  },
  registered: {
    main: '#757575', // Gris
    light: '#9e9e9e',
    dark: '#616161',
    contrastText: '#ffffff'
  }
};

// Options pour le sélecteur de statut
export const STATUS_OPTIONS = [
  { value: 'vole', label: 'Volé', color: STATUS_COLORS.vole.main },
  { value: 'perdu', label: 'Perdu', color: STATUS_COLORS.perdu.main },
  { value: 'oublie', label: 'Oublié', color: STATUS_COLORS.oublie.main },
  { value: 'trouve', label: 'Trouvé', color: STATUS_COLORS.trouve.main },
  { value: 'registered', label: 'Enregistré', color: STATUS_COLORS.registered.main }
];

// Fonction pour obtenir la couleur en fonction du statut
export const getStatusColor = (status) => {
  const statusMap = {
    'STOLEN': STATUS_COLORS.vole.main,
    'LOST': STATUS_COLORS.perdu.main,
    'FORGOTTEN': STATUS_COLORS.oublie.main
  };
  return statusMap[status] || '#757575'; // Couleur par défaut si le statut n'est pas reconnu
};

// Styles pour les boutons de statut
export const getStatusButtonStyles = (status) => {
  const color = STATUS_COLORS[status];
  if (!color) return {};

  return {
    backgroundColor: color.main,
    color: color.contrastText,
    '&:hover': {
      backgroundColor: color.dark,
    },
    '&.Mui-disabled': {
      backgroundColor: color.light,
      color: color.contrastText,
    },
  };
};

// Styles pour les puces (chips) de statut
export const getStatusChipStyles = (status) => {
  const colors = STATUS_COLORS[status];
  if (!colors) return {};

  return {
    backgroundColor: colors.main,
    color: colors.contrastText,
    '&:hover': {
      backgroundColor: colors.dark,
    }
  };
};

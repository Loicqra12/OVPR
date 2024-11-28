import { createTheme } from '@mui/material/styles';

// Couleurs communes aux deux thèmes
const commonColors = {
  primary: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
  secondary: {
    main: '#f50057',
    light: '#ff4081',
    dark: '#c51162',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
  },
};

// Thème clair
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...commonColors,
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Thème sombre
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...commonColors,
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

export { lightTheme, darkTheme };

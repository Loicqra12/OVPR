import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6B46C1', // Violet principal
      light: '#9F7AEA',
      dark: '#553C9A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F6E05E', // Jaune doré
      light: '#FAF089',
      dark: '#D69E2E',
      contrastText: '#1A202C',
    },
    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF',
    },
    success: {
      main: '#48BB78',
      light: '#9AE6B4',
      dark: '#2F855A',
    },
    error: {
      main: '#E53E3E',
      light: '#FC8181',
      dark: '#C53030',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2D3748',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2D3748',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#2D3748',
    },
    subtitle1: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#4A5568',
    },
    body1: {
      fontSize: '1rem',
      color: '#4A5568',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export default theme;

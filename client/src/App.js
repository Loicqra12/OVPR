import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnnouncementProvider } from './contexts/AnnouncementContext';
import { MessageProvider } from './contexts/MessageContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import SearchStats from './components/admin/SearchStats';
import AdminChatLayout from './components/admin/AdminChatLayout';

// Chat Components
import UserChat from './components/chat/UserChat';

// Création du thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Route protégée qui vérifie l'authentification
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navbar />
        <div style={{ flex: 1, position: 'relative' }}>
          <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes Protégées */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            {/* Routes Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/search-stats" element={<SearchStats />} />
            <Route path="/admin/chat" element={<AdminChatLayout />} />
            
            {/* Routes Chat */}
            <Route path="/chat" element={<UserChat />} />
          </Routes>

          {/* Afficher le chat flottant sur toutes les pages si l'utilisateur est connecté */}
          {isAuthenticated && user?.role === 'user' && (
            <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
              <UserChat />
            </div>
          )}
        </div>
        <Footer />
      </div>
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AnnouncementProvider>
          <MessageProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
              <CssBaseline />
              <AppContent />
            </LocalizationProvider>
          </MessageProvider>
        </AnnouncementProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

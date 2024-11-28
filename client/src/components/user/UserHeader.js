import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const UserHeader = ({ activeSection, onSectionChange, notificationCount }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Rediriger vers la page de connexion
    window.location.href = '/login';
  };

  const handleNotificationClick = (notification) => {
    // Marquer la notification comme lue
    console.log('Notification clicked:', notification);
    handleNotificationClose();
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      }}
    >
      <Toolbar>
        {/* Logo et Nom */}
        <Typography
          variant="h6"
          component="div"
          sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}
        >
          OVPR
        </Typography>

        {/* Menu de Navigation */}
        <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => onSectionChange('home')}
            sx={{
              mx: 1,
              ...(activeSection === 'home' && {
                borderBottom: '2px solid white',
              }),
            }}
          >
            Accueil
          </Button>
          <Button
            color="inherit"
            onClick={() => onSectionChange('announcements')}
            sx={{
              mx: 1,
              ...(activeSection === 'announcements' && {
                borderBottom: '2px solid white',
              }),
            }}
          >
            Mes Annonces
          </Button>
          <Button
            color="inherit"
            startIcon={<SearchIcon />}
            onClick={() => onSectionChange('search')}
            sx={{
              mx: 1,
              ...(activeSection === 'search' && {
                borderBottom: '2px solid white',
              }),
            }}
          >
            Rechercher
          </Button>
        </Box>

        {/* Notifications */}
        <IconButton
          color="inherit"
          onClick={handleNotificationOpen}
          sx={{ ml: 2 }}
        >
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          sx={{ mt: 2 }}
        >
          {notificationCount > 0 ? (
            [1, 2, 3].map((notification) => (
              <MenuItem
                key={notification}
                onClick={() => handleNotificationClick(notification)}
              >
                Notification {notification}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Aucune notification</MenuItem>
          )}
        </Menu>

        {/* Menu Utilisateur */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            onClick={() => onSectionChange('settings')}
            sx={{ ml: 1 }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Box>

        {/* Menu déroulant utilisateur */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleMenuClose();
            onSectionChange('profile');
          }}>
            Mon Profil
          </MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            onSectionChange('settings');
          }}>
            Paramètres
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Déconnexion
          </MenuItem>
        </Menu>

        <IconButton
          color="inherit"
          onClick={handleLogout}
          sx={{ ml: 2 }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;

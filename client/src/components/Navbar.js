import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Badge } from '@mui/material';
import logo from '../assets/logoovpr.PNG';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationCenter from './NotificationCenter';
import SideMenu from './layout/SideMenu';
import ThemeToggle from './layout/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useMessages } from '../contexts/MessageContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { unreadCount } = useMessages();

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          <Box component={Link} to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src={logo} alt="OVPR Logo" style={{ height: '40px', marginRight: '10px' }} />
            <Typography variant="h6">
              OVPR
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            
            <Button
              color="inherit"
              component={Link}
              to="/search"
              startIcon={<SearchIcon />}
              sx={{ mr: 1 }}
            >
              Rechercher
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/nearby"
              startIcon={<LocationOnIcon />}
              sx={{ mr: 1 }}
            >
              Aux alentours
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/dashboard/items"
              startIcon={<InventoryIcon />}
              sx={{ mr: 1 }}
            >
              Mes Biens
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationCenter />
              {/* Messages */}
              {currentUser?.role === 'admin' && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/admin/chat"
                  startIcon={<ChatIcon />}
                >
                  Messagerie
                </Button>
              )}
              {currentUser?.role === 'user' && (
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/chat"
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <ChatIcon />
                  </Badge>
                </IconButton>
              )}
              {currentUser ? (
                <IconButton
                  component={Link}
                  to="/profile"
                  sx={{ p: 0 }}
                >
                  <Avatar
                    src={currentUser.avatar}
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    sx={{ width: 40, height: 40 }}
                  />
                </IconButton>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Se connecter
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/register"
                    variant="outlined"
                    sx={{
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Créer un compte
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <SideMenu open={menuOpen} onClose={handleMenuClose} />
    </>
  );
};

export default Navbar;

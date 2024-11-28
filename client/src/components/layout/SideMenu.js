import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ReportIcon from '@mui/icons-material/Report';
import InventoryIcon from '@mui/icons-material/Inventory';
import MapIcon from '@mui/icons-material/Map';
import NearMeIcon from '@mui/icons-material/NearMe';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { getCurrentUser } from '../../data/mockUsers';

const menuItems = [
  { text: 'Les Zones a risques en temps réels', icon: <LocationOnIcon />, path: '/nearby' },
  { text: 'Carte des objets', icon: <MapIcon />, path: '/map' },
  { text: 'Annonces', icon: <AnnouncementIcon />, path: '/announcements' },
  { text: 'Rechercher', icon: <SearchIcon />, path: '/search' },
  { text: 'Mes Biens', icon: <InventoryIcon />, path: '/dashboard/items' },
  { divider: true },
  { text: 'Messages', icon: <ChatIcon />, path: '/chat' },
  { text: 'Mon Profil', icon: <PersonIcon />, path: '/profile' },
  { divider: true },
  { text: 'Déclarer un objet trouvé', icon: <AddIcon />, path: '/declare-found' },
  { text: 'Déclarer un objet perdu', icon: <ReportIcon />, path: '/declare-lost' },
];

const adminMenuItem = {
  text: 'Administration',
  icon: <AdminPanelSettingsIcon />,
  path: '/admin/login',
  adminOnly: true
};

const SideMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: '#1a237e',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {currentUser && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={currentUser.avatar}
            alt={`${currentUser.firstName} ${currentUser.lastName}`}
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="subtitle1">
              {`${currentUser.firstName} ${currentUser.lastName}`}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {currentUser.email}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

      <List>
        {menuItems.map((item, index) => (
          item.divider ? (
            <Divider key={index} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
          ) : (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}

        {/* Lien d'administration (visible uniquement pour les admins) */}
        {isAdmin && (
          <>
            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
            <ListItem
              button
              onClick={() => handleNavigation(adminMenuItem.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                backgroundColor: 'rgba(255, 152, 0, 0.15)',
              }}
            >
              <ListItemIcon sx={{ color: 'orange' }}>
                {adminMenuItem.icon}
              </ListItemIcon>
              <ListItemText 
                primary={adminMenuItem.text}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    color: 'orange',
                    fontWeight: 'bold'
                  }
                }} 
              />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default SideMenu;

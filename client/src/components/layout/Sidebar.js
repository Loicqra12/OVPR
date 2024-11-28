import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReportIcon from '@mui/icons-material/Report';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const menuItems = [
  { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Rechercher', icon: <SearchIcon />, path: '/search' },
  { text: 'Ajouter un objet', icon: <AddIcon />, path: '/add-item' },
  { text: 'Les Zones a risque', icon: <LocationOnIcon />, path: '/nearby' },
  { text: 'Déclarer un incident', icon: <ReportIcon />, path: '/declare-incident' },
  { text: 'Profil', icon: <PersonIcon />, path: '/profile' },
  { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          color: 'white',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" component="div">
            OVPR
          </Typography>
          <Typography variant="caption" display="block">
            Object Verification & Property Recovery
          </Typography>
        </Box>
        
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
        
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: { fontSize: '0.9rem' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

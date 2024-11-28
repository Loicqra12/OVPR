import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getSavedSearches, deleteSavedSearch } from '../../api/search';

const SavedSearches = () => {
  const navigate = useNavigate();
  const [savedSearches, setSavedSearches] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(false);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      const searches = await getSavedSearches();
      setSavedSearches(searches);
    } catch (error) {
      console.error('Erreur lors du chargement des recherches sauvegardées:', error);
    }
  };

  const handleDelete = async (searchId) => {
    try {
      await deleteSavedSearch(searchId);
      setSavedSearches(prevSearches => 
        prevSearches.filter(search => search.id !== searchId)
      );
      setConfirmDelete(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de la recherche:', error);
    }
  };

  const handleSearch = (search) => {
    navigate('/search', { state: { filters: search.criteria } });
  };

  const handleNotificationToggle = (searchId) => {
    setSelectedSearch(savedSearches.find(search => search.id === searchId));
    setNotificationSettings(true);
  };

  const formatSearchCriteria = (criteria) => {
    const chips = [];
    if (criteria.keyword) {
      chips.push({ label: `Mot-clé: ${criteria.keyword}`, color: 'primary' });
    }
    if (criteria.category && criteria.category !== 'Tous') {
      chips.push({ label: `Catégorie: ${criteria.category}`, color: 'secondary' });
    }
    if (criteria.location) {
      chips.push({ label: `Lieu: ${criteria.location}`, color: 'info' });
    }
    if (criteria.status && criteria.status !== 'all') {
      chips.push({ label: `Statut: ${criteria.status}`, color: 'warning' });
    }
    return chips;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Mes recherches sauvegardées
      </Typography>
      <Paper>
        <List>
          {savedSearches.map((search, index) => (
            <React.Fragment key={search.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={search.name}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {formatSearchCriteria(search.criteria).map((chip, i) => (
                        <Chip
                          key={i}
                          label={chip.label}
                          color={chip.color}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleNotificationToggle(search.id)}
                    sx={{ mr: 1 }}
                  >
                    <NotificationsIcon color={search.notifications ? 'primary' : 'action'} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleSearch(search)}
                    sx={{ mr: 1 }}
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setSelectedSearch(search);
                      setConfirmDelete(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
          {savedSearches.length === 0 && (
            <ListItem>
              <ListItemText
                primary="Aucune recherche sauvegardée"
                secondary="Sauvegardez vos critères de recherche pour être notifié des nouvelles annonces correspondantes."
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette recherche sauvegardée ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>
            Annuler
          </Button>
          <Button
            onClick={() => handleDelete(selectedSearch?.id)}
            color="error"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog des paramètres de notification */}
      <Dialog
        open={notificationSettings}
        onClose={() => setNotificationSettings(false)}
      >
        <DialogTitle>Paramètres de notification</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={selectedSearch?.notifications}
                onChange={(e) => {
                  // Implémenter la mise à jour des paramètres de notification
                }}
              />
            }
            label="Recevoir des notifications"
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Vous serez notifié par email lorsque de nouvelles annonces correspondent à vos critères.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationSettings(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedSearches;

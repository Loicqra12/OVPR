import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import HistoryIcon from '@mui/icons-material/History';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import ItemCard from '../item/ItemCard';
import { PieChart, BarChart } from '@mui/x-charts';
import BadgeProgress from './BadgeProgress';
import { itemsApi } from '../../api';
import { mockItems } from '../../data/mockItems';
import StatusButtons from '../common/StatusButtons';
import { announcementService } from '../../services/announcementService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateAnnouncement } = useAnnouncements();

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [items, setItems] = useState(mockItems);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setItems(mockItems);
  }, []);

  const handleItemStatusChange = async (itemId, newStatus) => {
    try {
      const itemToUpdate = items.find(item => item.id === itemId);
      if (!itemToUpdate) {
        throw new Error('Item not found');
      }

      const formattedImages = itemToUpdate.images ? itemToUpdate.images.map(image => ({
        url: image.url || image,
        alt: image.alt || `Image de ${itemToUpdate.name || 'l\'objet'}`,
        title: image.title || `Vue de ${itemToUpdate.name || 'l\'objet'}`
      })) : [];

      const announcement = {
        itemId: itemId,
        title: itemToUpdate.name || 'Objet sans nom',
        description: itemToUpdate.description || '',
        status: newStatus,
        category: itemToUpdate.category || 'Non catégorisé',
        location: itemToUpdate.location || '',
        images: formattedImages,
        userId: user?.id,
        date: new Date().toISOString()
      };

      const createdAnnouncement = await announcementService.createAnnouncement(announcement);
      
      if (createdAnnouncement) {
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId 
              ? { ...item, status: newStatus }
              : item
          )
        );

        const statusMessages = {
          vole: 'Votre bien a été déclaré comme volé',
          perdu: 'Votre bien a été déclaré comme perdu',
          oublie: 'Votre bien a été déclaré comme oublié'
        };

        setSnackbar({
          open: true,
          message: `${statusMessages[newStatus]} et ajouté aux annonces`,
          severity: 'success'
        });

        navigate('/announcements');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Erreur lors de la mise à jour du statut',
        severity: 'error'
      });
    }
  };

  const handleGalleryOpen = () => {
    setIsGalleryOpen(true);
  };

  const handleGalleryClose = () => {
    setIsGalleryOpen(false);
  };

  const stats = {
    registered: {
      total: 10,
      categoryDataRegistered: [
        { label: 'Catégorie 1', value: 5 },
        { label: 'Catégorie 2', value: 3 },
        { label: 'Catégorie 3', value: 2 }
      ]
    },
    found: {
      total: 5,
      successRate: 80,
      rewards: 10000,
      badge: 'Bronze',
      nextBadgeProgress: 50,
      requiredForNextBadge: 10
    },
    history: {
      total: 20,
      distribution: [
        { label: 'Action 1', value: 5 },
        { label: 'Action 2', value: 3 },
        { label: 'Action 3', value: 2 }
      ],
      badges: ['Bronze', 'Argent']
    }
  };

  const getBadgeDescription = (badge) => {
    switch (badge) {
      case 'Bronze':
        return 'Vous avez atteint le niveau Bronze';
      case 'Argent':
        return 'Vous avez atteint le niveau Argent';
      default:
        return 'Vous avez atteint un niveau inconnu';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Enregistrer un Bien */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => navigate('/add-item')}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    bgcolor: 'primary.light',
                    borderRadius: '50%',
                    p: 1,
                    mr: 2
                  }}
                >
                  <AddIcon color="primary" />
                </Box>
                <Typography variant="h6">Enregistrer un Bien</Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGalleryOpen();
                }}
                sx={{ ml: 2 }}
              >
                Voir les biens
              </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total des biens enregistrés
              </Typography>
              <Typography variant="h4" color="primary.main">
                {stats.registered.total}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, minHeight: 200, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Répartition par catégorie
              </Typography>
              <PieChart
                series={[{
                  data: stats.registered.categoryDataRegistered,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  innerRadius: 30,
                  paddingAngle: 2,
                  cornerRadius: 4
                }]}
                height={200}
                slotProps={{
                  legend: {
                    hidden: true
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Déclarer un Bien Retrouvé */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => navigate('/dashboard/found-items')}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  bgcolor: 'info.light',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}
              >
                <FindInPageIcon color="info" />
              </Box>
              <Typography variant="h6">Déclarer un Bien Retrouvé</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total retrouvé
                </Typography>
                <Typography variant="h4" color="info.main">
                  {stats.found.total}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Taux de succès
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.found.successRate}%
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Récompenses obtenues
              </Typography>
              <Typography variant="h6" color="warning.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <EmojiEventsIcon sx={{ mr: 1 }} />
                {stats.found.rewards.toLocaleString()} FCFA
              </Typography>
            </Box>

            <BadgeProgress
              currentBadge={stats.found.badge}
              progress={stats.found.nextBadgeProgress}
              remainingCount={stats.found.requiredForNextBadge}
              getBadgeDescription={getBadgeDescription}
              color="info"
            />
          </Paper>
        </Grid>

        {/* Historique */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  bgcolor: 'success.light',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}
              >
                <HistoryIcon color="success" />
              </Box>
              <Typography variant="h6">Historique</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total des actions
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.history.total}
              </Typography>
            </Box>

            <Box sx={{ mb: 3, height: 200 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Distribution des actions
              </Typography>
              <BarChart
                series={[{
                  data: stats.history.distribution.map(d => d.value),
                  color: '#4caf50'
                }]}
                height={180}
                xAxis={[{
                  data: stats.history.distribution.map(d => d.label),
                  scaleType: 'band'
                }]}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Badges obtenus
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {stats.history.badges.map((badge, index) => (
                  <Tooltip key={index} title={getBadgeDescription(badge)}>
                    <Chip
                      icon={<EmojiEventsIcon />}
                      label={badge}
                      color="success"
                      variant={index < 2 ? "filled" : "outlined"}
                      size="small"
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog pour afficher les biens */}
      <Dialog
        open={isGalleryOpen}
        onClose={handleGalleryClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Mes Biens Enregistrés</Typography>
            <IconButton onClick={handleGalleryClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : items.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography color="text.secondary">
                Vous n'avez pas encore enregistré de biens.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/add-item')}
                sx={{ mt: 2 }}
              >
                Enregistrer un bien
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <ItemCard
                    item={item}
                    onStatusChange={(newStatus) => handleItemStatusChange(item.id, newStatus)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
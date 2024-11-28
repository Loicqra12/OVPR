import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import rewardService, { BADGE_TYPES, BADGES_CONFIG } from '../../services/rewardService';
import { useAuth } from '../../contexts/AuthContext';

const BadgeCard = ({ badge, onClick }) => (
  <Card 
    sx={{ 
      cursor: 'pointer',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h2" component="span" sx={{ fontSize: '2rem' }}>
          {badge.icon}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {Math.round(badge.progress * 100)}%
        </Typography>
      </Box>
      <Typography variant="h6" gutterBottom>
        {badge.name}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={badge.progress * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: badge.isComplete ? 'success.main' : 'primary.main'
          }
        }}
      />
      <Typography variant="body2" color="text.secondary" mt={1}>
        {badge.current} / {badge.requirement}
      </Typography>
    </CardContent>
  </Card>
);

const UserBadges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    itemsHelped: 0,
    itemsFound: 0,
    positiveRatings: 0,
    totalInteractions: 0,
    totalBadges: 0
  });

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const rewards = await rewardService.getUserRewards(user.id);
        setStats(rewards.stats);
        
        // Calculer la progression pour chaque badge
        const badgesProgress = Object.values(BADGE_TYPES).map(type => 
          rewardService.getBadgeProgress(rewards.stats, type)
        );
        setBadges(badgesProgress);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    if (user) {
      loadUserStats();
    }
  }, [user]);

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Mes Badges
        </Typography>
        <Tooltip title="Gagnez des badges en participant activement à la communauté">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {badges.map((badge, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <BadgeCard 
              badge={badge}
              onClick={() => handleBadgeClick(badge)}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedBadge && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h2" component="span" sx={{ fontSize: '3rem' }}>
                  {selectedBadge.icon}
                </Typography>
                <Box>
                  <Typography variant="h6">
                    {selectedBadge.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBadge.isComplete ? 'Badge obtenu' : 'En progression'}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedBadge.description}
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Progression
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={selectedBadge.progress * 100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      backgroundColor: selectedBadge.isComplete ? 'success.main' : 'primary.main'
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {selectedBadge.current} / {selectedBadge.requirement}
                  {selectedBadge.isComplete ? ' (Complété)' : ''}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default UserBadges;

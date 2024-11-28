import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  Grid,
  Tooltip,
  IconButton,
  Collapse,
  Alert,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Refresh as RefreshIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
} from '@mui/icons-material';
import challengeService, { CHALLENGE_TYPES } from '../../services/challengeService';
import { useAuth } from '../../contexts/AuthContext';

const ChallengeCard = ({ challenge, onClaim }) => {
  const [expanded, setExpanded] = useState(false);

  const progressColor = challenge.progress >= 1 
    ? 'success.main'
    : challenge.progress > 0.6 
      ? 'warning.main' 
      : 'primary.main';

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {challenge.progress >= 1 && (
        <TrophyIcon
          sx={{
            position: 'absolute',
            top: -12,
            right: -12,
            color: 'success.main',
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: '4px',
            boxShadow: 2,
          }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant="h2" component="span" sx={{ fontSize: '2rem' }}>
            {challenge.icon}
          </Typography>
          <Typography variant="h6" component="h3">
            {challenge.title}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {challenge.description}
        </Typography>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Progression
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(challenge.progress * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={challenge.progress * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: progressColor
              }
            }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {challenge.current} / {challenge.target}
          </Typography>
          <Typography variant="body2" color="primary">
            +{challenge.points} points
          </Typography>
        </Box>

        {challenge.progress >= 1 && !challenge.claimed && (
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => onClaim(challenge.id)}
          >
            Réclamer
          </Button>
        )}
      </CardContent>

      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 1,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Voir les détails"
        >
          {expanded ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Conseils pour compléter ce défi :
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {challenge.tips?.map((tip, index) => (
              <li key={index}>
                <Typography variant="body2" color="text.secondary">
                  {tip}
                </Typography>
              </li>
            ))}
          </ul>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const DailyChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const loadChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await challengeService.getDailyChallenges(user.id);
      setChallenges(data);
    } catch (err) {
      setError('Erreur lors du chargement des défis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadChallenges();
    }
  }, [user]);

  const handleClaim = async (challengeId) => {
    try {
      await challengeService.claimReward(user.id, challengeId);
      setSuccessMessage('Récompense réclamée avec succès !');
      // Mettre à jour la liste des défis
      loadChallenges();
      // Effacer le message après 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Erreur lors de la réclamation de la récompense');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Défis du Jour
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 200 }}>
                    <LinearProgress />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Défis du Jour
        </Typography>
        <Tooltip title="Actualiser les défis">
          <IconButton onClick={loadChallenges}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {challenges.map((challenge) => (
          <Grid item xs={12} sm={6} md={4} key={challenge.id}>
            <ChallengeCard
              challenge={challenge}
              onClaim={handleClaim}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DailyChallenges;

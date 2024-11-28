import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import rewardService from '../../services/rewardService';
import { useAuth } from '../../contexts/AuthContext';

const UserLevel = () => {
  const { user } = useAuth();
  const [levelInfo, setLevelInfo] = useState({
    currentLevel: 1,
    pointsForNextLevel: 100,
    totalPoints: 0
  });

  useEffect(() => {
    const loadUserLevel = async () => {
      try {
        const rewards = await rewardService.getUserRewards(user.id);
        const levelData = rewardService.calculateLevel(rewards.totalPoints);
        setLevelInfo(levelData);
      } catch (error) {
        console.error('Erreur lors du chargement du niveau:', error);
      }
    };

    if (user) {
      loadUserLevel();
    }
  }, [user]);

  const progress = Math.round(
    ((levelInfo.totalPoints - (levelInfo.currentLevel * (levelInfo.currentLevel - 1) * 50)) /
    (levelInfo.pointsForNextLevel)) * 100
  );

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Niveau {levelInfo.currentLevel}
          </Typography>
          <Tooltip title="Gagnez des points en aidant la communauté à retrouver des objets">
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box position="relative" mb={1}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 20,
              borderRadius: 2,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                backgroundColor: 'primary.main'
              }
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {progress}%
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Points totaux : {levelInfo.totalPoints}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prochain niveau : {levelInfo.pointsForNextLevel} points
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserLevel;

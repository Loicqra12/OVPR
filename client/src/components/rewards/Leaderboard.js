import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Whatshot as HotIcon,
} from '@mui/icons-material';
import rewardService from '../../services/rewardService';

const PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  ALL_TIME: 'all-time'
};

const LeaderAvatar = ({ position, avatarUrl }) => {
  const getColor = (pos) => {
    switch (pos) {
      case 1: return '#FFD700'; // Or
      case 2: return '#C0C0C0'; // Argent
      case 3: return '#CD7F32'; // Bronze
      default: return 'transparent';
    }
  };

  return (
    <Box position="relative">
      <Avatar
        src={avatarUrl}
        sx={{
          width: position <= 3 ? 56 : 40,
          height: position <= 3 ? 56 : 40,
          border: `3px solid ${getColor(position)}`
        }}
      />
      {position <= 3 && (
        <TrophyIcon
          sx={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            color: getColor(position),
            backgroundColor: 'white',
            borderRadius: '50%'
          }}
        />
      )}
    </Box>
  );
};

const Leaderboard = () => {
  const [period, setPeriod] = useState(PERIODS.MONTH);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await rewardService.getLeaderboard(period);
        setLeaders(data);
      } catch (error) {
        console.error('Erreur lors du chargement du classement:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [period]);

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Classement
          </Typography>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={handlePeriodChange}
            size="small"
          >
            <ToggleButton value={PERIODS.WEEK}>
              Semaine
            </ToggleButton>
            <ToggleButton value={PERIODS.MONTH}>
              Mois
            </ToggleButton>
            <ToggleButton value={PERIODS.ALL_TIME}>
              Tout
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <List>
          {loading ? (
            Array.from(new Array(5)).map((_, index) => (
              <ListItem key={index} divider>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton width="60%" />}
                  secondary={<Skeleton width="30%" />}
                />
              </ListItem>
            ))
          ) : (
            leaders.map((user, index) => (
              <ListItem
                key={user.id}
                divider={index < leaders.length - 1}
                sx={{
                  backgroundColor: index < 3 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemAvatar>
                  <LeaderAvatar
                    position={index + 1}
                    avatarUrl={user.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" component="span">
                        {index + 1}. {user.name}
                      </Typography>
                      {user.isHot && (
                        <HotIcon color="error" fontSize="small" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {user.points} points • Niveau {user.level}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;

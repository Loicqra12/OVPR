import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Tooltip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const BadgeProgress = ({ 
  currentBadge, 
  progress, 
  remainingCount, 
  getBadgeDescription,
  color = 'primary'
}) => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Badge actuel
        </Typography>
        <Tooltip title={getBadgeDescription(currentBadge)}>
          <Chip
            icon={<EmojiEventsIcon />}
            label={currentBadge}
            color={color}
            sx={{ mt: 1 }}
          />
        </Tooltip>
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Progression prochain badge
        </Typography>
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: `${color}.lighter`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: `${color}.main`,
                borderRadius: 4
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Plus que {remainingCount} {remainingCount > 1 ? 'objets' : 'objet'} pour le prochain niveau
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default BadgeProgress;

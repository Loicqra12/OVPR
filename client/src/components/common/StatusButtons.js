import React from 'react';
import { Button, ButtonGroup, Box } from '@mui/material';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { STATUS_COLORS } from '../../theme/statusTheme';

const StatusButtons = ({ itemId, currentStatus, onStatusChange }) => {
  const { updateAnnouncement } = useAnnouncements();

  const handleStatusChange = async (newStatus) => {
    try {
      await updateAnnouncement(itemId, { status: newStatus });
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
      <ButtonGroup variant="contained" aria-label="status button group">
        <Button
          onClick={() => handleStatusChange('STOLEN')}
          sx={{
            bgcolor: STATUS_COLORS.vole.main,
            '&:hover': { bgcolor: STATUS_COLORS.vole.dark },
            ...(currentStatus === 'STOLEN' && { 
              bgcolor: STATUS_COLORS.vole.dark,
              '&:hover': { bgcolor: STATUS_COLORS.vole.dark }
            })
          }}
        >
          Volé
        </Button>
        <Button
          onClick={() => handleStatusChange('LOST')}
          sx={{
            bgcolor: STATUS_COLORS.perdu.main,
            '&:hover': { bgcolor: STATUS_COLORS.perdu.dark },
            ...(currentStatus === 'LOST' && {
              bgcolor: STATUS_COLORS.perdu.dark,
              '&:hover': { bgcolor: STATUS_COLORS.perdu.dark }
            })
          }}
        >
          Perdu
        </Button>
        <Button
          onClick={() => handleStatusChange('FORGOTTEN')}
          sx={{
            bgcolor: STATUS_COLORS.oublie.main,
            '&:hover': { bgcolor: STATUS_COLORS.oublie.dark },
            ...(currentStatus === 'FORGOTTEN' && {
              bgcolor: STATUS_COLORS.oublie.dark,
              '&:hover': { bgcolor: STATUS_COLORS.oublie.dark }
            })
          }}
        >
          Oublié
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default StatusButtons;

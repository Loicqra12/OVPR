import React from 'react';
import {
  Box,
  Button,
  Tooltip,
  alpha
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const ItemStatusButtons = ({ onStatusChange, currentStatus = '' }) => {
  const statusButtons = [
    {
      label: 'Perdu',
      value: 'perdu',
      color: '#d32f2f', // Rouge plus vif
      hoverColor: '#b71c1c', // Rouge foncé
      lightColor: '#ffebee', // Rouge très clair pour le fond
      icon: <ErrorOutlineIcon />,
      tooltip: 'Marquer comme perdu'
    },
    {
      label: 'Oublié',
      value: 'oublie',
      color: '#1976d2', // Bleu plus vif
      hoverColor: '#0d47a1', // Bleu foncé
      lightColor: '#e3f2fd', // Bleu très clair pour le fond
      icon: <HelpOutlineIcon />,
      tooltip: 'Marquer comme oublié'
    },
    {
      label: 'Volé',
      value: 'vole',
      color: '#f57c00', // Orange plus vif
      hoverColor: '#e65100', // Orange foncé
      lightColor: '#fff3e0', // Orange très clair pour le fond
      icon: <ReportProblemOutlinedIcon />,
      tooltip: 'Marquer comme volé'
    }
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        mt: 2,
        mb: 1,
        justifyContent: 'center',
        width: '100%'
      }}
    >
      {statusButtons.map((button) => (
        <Tooltip 
          key={button.value} 
          title={button.tooltip}
          arrow
          placement="top"
        >
          <Button
            variant="contained"
            startIcon={button.icon}
            onClick={() => onStatusChange?.(button.value)}
            sx={{
              flex: 1,
              py: 1.2,
              backgroundColor: currentStatus === button.value ? button.hoverColor : button.color,
              color: '#fff',
              transition: 'all 0.3s ease',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: currentStatus === button.value 
                ? `0 4px 10px ${alpha(button.color, 0.4)}`
                : `0 2px 6px ${alpha(button.color, 0.2)}`,
              '&:hover': {
                backgroundColor: button.hoverColor,
                boxShadow: `0 6px 12px ${alpha(button.color, 0.4)}`,
                transform: 'translateY(-2px)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: `0 3px 8px ${alpha(button.color, 0.3)}`
              },
              ...(currentStatus === button.value && {
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 6,
                  height: 6,
                  backgroundColor: button.hoverColor,
                  borderRadius: '50%'
                }
              })
            }}
          >
            {button.label}
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
};

export default ItemStatusButtons;

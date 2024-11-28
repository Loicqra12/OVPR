import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { STATUS_OPTIONS } from '../../theme/statusTheme';

const ColoredMenuItem = styled(MenuItem)(({ color }) => ({
  '&.Mui-selected': {
    backgroundColor: `${color}15`, // Ajoute une transparence de 15%
    '&:hover': {
      backgroundColor: `${color}25`, // Plus foncé au survol
    }
  },
  '&:hover': {
    backgroundColor: `${color}10`, // Légère teinte au survol
  }
}));

const StatusIndicator = styled(Box)(({ color }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
  marginRight: 8,
  display: 'inline-block',
}));

const StatusSelect = ({ value, onChange, required = false, label = "Statut" }) => {
  return (
    <FormControl fullWidth required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={onChange}
      >
        {STATUS_OPTIONS.map((option) => (
          <ColoredMenuItem
            key={option.value}
            value={option.value}
            color={option.color}
          >
            <Box display="flex" alignItems="center">
              <StatusIndicator color={option.color} />
              {option.label}
            </Box>
          </ColoredMenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StatusSelect;

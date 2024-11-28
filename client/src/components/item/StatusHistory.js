import React from 'react';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import {
    Paper,
    Typography,
    Box,
    Tooltip,
    IconButton,
} from '@mui/material';
import {
    Search as SearchIcon,
    FindInPage as FindIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Inventory as InventoryIcon,
    LocalShipping as ShippingIcon,
} from '@mui/icons-material';

const statusIcons = {
    FOUND: <FindIcon />,
    LOST: <SearchIcon />,
    CLAIMED: <CheckCircleIcon />,
    REJECTED: <CancelIcon />,
    IN_STORAGE: <InventoryIcon />,
    IN_TRANSIT: <ShippingIcon />,
};

const statusColors = {
    FOUND: 'success',
    LOST: 'warning',
    CLAIMED: 'info',
    REJECTED: 'error',
    IN_STORAGE: 'primary',
    IN_TRANSIT: 'secondary',
};

const StatusHistory = ({ history = [] }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Historique des statuts
            </Typography>
            
            <Timeline position="alternate">
                {history.map((entry, index) => (
                    <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary">
                            {formatDate(entry.timestamp)}
                        </TimelineOppositeContent>
                        
                        <TimelineSeparator>
                            <TimelineDot color={statusColors[entry.status]}>
                                {statusIcons[entry.status]}
                            </TimelineDot>
                            {index < history.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        
                        <TimelineContent>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" component="span">
                                    {entry.status}
                                </Typography>
                                
                                {entry.comment && (
                                    <Typography>
                                        {entry.comment}
                                    </Typography>
                                )}
                                
                                {entry.user && (
                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Par: {entry.user.username}
                                        </Typography>
                                        <Tooltip title={entry.user.email}>
                                            <IconButton size="small">
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                )}
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>

            {history.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                    Aucun historique disponible
                </Typography>
            )}
        </Paper>
    );
};

export default StatusHistory;

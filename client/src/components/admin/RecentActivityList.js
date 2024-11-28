import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  PostAdd as PostAddIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Report as ReportIcon,
} from '@mui/icons-material';

const getActivityIcon = (type) => {
  switch (type) {
    case 'user':
      return <PersonIcon />;
    case 'announce':
      return <PostAddIcon />;
    case 'transaction':
      return <AttachMoneyIcon />;
    case 'report':
      return <ReportIcon />;
    default:
      return <PostAddIcon />;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'user':
      return 'primary';
    case 'announce':
      return 'success';
    case 'transaction':
      return 'warning';
    case 'report':
      return 'error';
    default:
      return 'default';
  }
};

const RecentActivityList = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Aucune activité récente
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {activities.map((activity, index) => (
        <React.Fragment key={activity.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: (theme) => theme.palette[getActivityColor(activity.type)].main }}>
                {getActivityIcon(activity.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">
                    {activity.title}
                  </Typography>
                  <Chip
                    label={activity.type}
                    size="small"
                    color={getActivityColor(activity.type)}
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {activity.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(activity.timestamp).toLocaleString()} - par {activity.user}
                  </Typography>
                </>
              }
            />
          </ListItem>
          {index < activities.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default RecentActivityList;

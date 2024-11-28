import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Pagination,
  Skeleton,
  Button,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Category as CategoryIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SearchResults = ({ results, loading, page, totalPages, onPageChange, onItemClick }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'lost':
        return 'error';
      case 'found':
        return 'success';
      case 'returned':
        return 'info';
      default:
        return 'default';
    }
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={24} width="60%" />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="70%" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!results || results.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t('search.noResults')}
        </Typography>
        <Typography color="text.secondary" paragraph>
          {t('search.tryDifferent')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.href = '/'}
        >
          {t('search.backHome')}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {results.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                cursor: 'pointer',
              }}
              onClick={() => onItemClick(item)}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image || '/placeholder-image.jpg'}
                alt={item.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip
                    label={t(`status.${item.status}`)}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                  <Box>
                    <IconButton size="small" onClick={(e) => {
                      e.stopPropagation();
                      // Implémenter le partage
                    }}>
                      <ShareIcon />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => {
                      e.stopPropagation();
                      // Implémenter la sauvegarde
                    }}>
                      <BookmarkIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {t(`categories.${item.category.toLowerCase()}`)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {item.location}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(item.date), 'PPP', { locale: fr })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchResults;

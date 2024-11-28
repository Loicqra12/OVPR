import React from 'react';
import { Button, Box, Divider, Typography } from '@mui/material';
import { Facebook as FacebookIcon, Google as GoogleIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const SocialLogin = () => {
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    // Implémenter la connexion Google
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    // Implémenter la connexion Facebook
    console.log('Facebook login');
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Divider>
        <Typography variant="body2" color="text.secondary">
          {t('auth.orContinueWith')}
        </Typography>
      </Divider>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{
            borderColor: '#4285F4',
            color: '#4285F4',
            '&:hover': {
              borderColor: '#4285F4',
              backgroundColor: 'rgba(66, 133, 244, 0.04)',
            },
          }}
        >
          {t('auth.continueWithGoogle')}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FacebookIcon />}
          onClick={handleFacebookLogin}
          sx={{
            borderColor: '#1877F2',
            color: '#1877F2',
            '&:hover': {
              borderColor: '#1877F2',
              backgroundColor: 'rgba(24, 119, 242, 0.04)',
            },
          }}
        >
          {t('auth.continueWithFacebook')}
        </Button>
      </Box>
    </Box>
  );
};

export default SocialLogin;

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import QRCode from 'qrcode.react';

const TwoFactorAuth = () => {
  const [step, setStep] = useState('setup'); // setup, verify, enabled
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const setupTwoFactor = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setQrCodeData(data.qrCode);
        setSecret(data.secret);
        setStep('verify');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          code: verificationCode,
          secret: secret,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setStep('enabled');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSetup = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configurer l'authentification à deux facteurs
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={setupTwoFactor}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Commencer la configuration'}
      </Button>
    </Box>
  );

  const renderVerify = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Scanner le QR Code
      </Typography>
      <Box mb={3}>
        <QRCode value={qrCodeData} size={256} />
      </Box>
      <Typography variant="body1" gutterBottom>
        Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy, etc.)
      </Typography>
      <TextField
        fullWidth
        label="Code de vérification"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={verifyCode}
        disabled={loading || !verificationCode}
      >
        {loading ? <CircularProgress size={24} /> : 'Vérifier le code'}
      </Button>
    </Box>
  );

  const renderEnabled = () => (
    <Box>
      <Alert severity="success">
        L'authentification à deux facteurs est maintenant activée pour votre compte !
      </Alert>
      <Typography variant="body1" mt={2}>
        Vous devrez maintenant entrer un code de vérification à chaque connexion.
      </Typography>
    </Box>
  );

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {step === 'setup' && renderSetup()}
      {step === 'verify' && renderVerify()}
      {step === 'enabled' && renderEnabled()}
    </Paper>
  );
};

export default TwoFactorAuth;

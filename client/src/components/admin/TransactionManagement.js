import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });

  useEffect(() => {
    fetchTransactions();
  }, [dateRange]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dateRange),
      });
      
      const data = await response.json();
      if (response.ok) {
        setTransactions(data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenDialog(true);
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/admin/transactions/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dateRange),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Erreur lors de l'exportation');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      completed: { label: 'Complété', color: 'success' },
      pending: { label: 'En attente', color: 'warning' },
      failed: { label: 'Échoué', color: 'error' },
      refunded: { label: 'Remboursé', color: 'info' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Gestion des transactions</Typography>
        <Box display="flex" gap={2}>
          <DatePicker
            label="Date début"
            value={dateRange.start}
            onChange={(newValue) => setDateRange({ ...dateRange, start: newValue })}
          />
          <DatePicker
            label="Date fin"
            value={dateRange.end}
            onChange={(newValue) => setDateRange({ ...dateRange, end: newValue })}
          />
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
          >
            Exporter CSV
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Transaction</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.userName}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.amount}€</TableCell>
                <TableCell>{getStatusChip(transaction.status)}</TableCell>
                <TableCell>
                  <Tooltip title="Voir les détails">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(transaction)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md">
        <DialogTitle>Détails de la transaction</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box>
              <Typography variant="subtitle1">
                ID Transaction: {selectedTransaction.id}
              </Typography>
              <Typography variant="body1">
                Date: {new Date(selectedTransaction.date).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Utilisateur: {selectedTransaction.userName}
              </Typography>
              <Typography variant="body1">
                Type: {selectedTransaction.type}
              </Typography>
              <Typography variant="body1">
                Montant: {selectedTransaction.amount}€
              </Typography>
              <Typography variant="body1">
                Statut: {selectedTransaction.status}
              </Typography>
              <Typography variant="body1">
                Description: {selectedTransaction.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionManagement;

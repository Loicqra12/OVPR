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
  TablePagination,
  IconButton,
  Button,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const Announces = () => {
  const [announces, setAnnounces] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAnnounce, setSelectedAnnounce] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnounces();
  }, [page, rowsPerPage]);

  const fetchAnnounces = async () => {
    try {
      const response = await fetch(`/api/admin/announces?page=${page + 1}&limit=${rowsPerPage}`);
      const data = await response.json();
      setAnnounces(data.announces);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewAnnounce = (announce) => {
    window.open(`/announce/${announce._id}`, '_blank');
  };

  const handleEditAnnounce = (announce) => {
    setSelectedAnnounce(announce);
    setDialogOpen(true);
  };

  const handleUpdateAnnounce = async () => {
    try {
      const response = await fetch(`/api/admin/announces/${selectedAnnounce._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedAnnounce),
      });

      if (response.ok) {
        fetchAnnounces();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDeleteAnnounce = async (announceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        const response = await fetch(`/api/admin/announces/${announceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchAnnounces();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'resolved':
        return 'info';
      case 'reported':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'lost':
        return 'error';
      case 'found':
        return 'success';
      case 'stolen':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des annonces
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Propriétaire</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell>Signalements</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {announces.map((announce) => (
                <TableRow key={announce._id}>
                  <TableCell>{announce.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={announce.type}
                      color={getTypeColor(announce.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{announce.owner?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={announce.status}
                      color={getStatusColor(announce.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(announce.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {announce.reports?.length > 0 ? (
                      <Badge badgeContent={announce.reports.length} color="error">
                        <WarningIcon color="warning" />
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewAnnounce(announce)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditAnnounce(announce)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteAnnounce(announce._id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={-1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Modifier l'annonce</DialogTitle>
        <DialogContent>
          {selectedAnnounce && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Titre"
                value={selectedAnnounce.title}
                onChange={(e) =>
                  setSelectedAnnounce({
                    ...selectedAnnounce,
                    title: e.target.value,
                  })
                }
              />
              <TextField
                select
                label="Type"
                value={selectedAnnounce.type}
                onChange={(e) =>
                  setSelectedAnnounce({
                    ...selectedAnnounce,
                    type: e.target.value,
                  })
                }
              >
                <MenuItem value="lost">Perdu</MenuItem>
                <MenuItem value="found">Trouvé</MenuItem>
                <MenuItem value="stolen">Volé</MenuItem>
              </TextField>
              <TextField
                select
                label="Statut"
                value={selectedAnnounce.status}
                onChange={(e) =>
                  setSelectedAnnounce({
                    ...selectedAnnounce,
                    status: e.target.value,
                  })
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="resolved">Résolue</MenuItem>
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="reported">Signalée</MenuItem>
              </TextField>
              <TextField
                multiline
                rows={4}
                label="Description"
                value={selectedAnnounce.description}
                onChange={(e) =>
                  setSelectedAnnounce({
                    ...selectedAnnounce,
                    description: e.target.value,
                  })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleUpdateAnnounce} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Announces;

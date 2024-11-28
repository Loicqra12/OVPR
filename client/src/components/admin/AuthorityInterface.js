import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Chip,
    TextField,
    Alert,
    Grid
} from '@mui/material';
import axios from 'axios';

function AuthorityInterface() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('/api/admin/authority/items');
            setItems(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors du chargement des objets');
            setLoading(false);
        }
    };

    const handleOpenDialog = async (item) => {
        try {
            // Récupérer les informations détaillées de l'utilisateur
            const response = await axios.get(`/api/admin/authority/user/${item.owner._id}`);
            setSelectedItem({
                ...item,
                owner: response.data
            });
            setOpenDialog(true);
        } catch (err) {
            setError('Erreur lors du chargement des détails');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div>Chargement...</div>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    label="Rechercher un objet"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                />
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Numéro de série</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell>Propriétaire</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.serialNumber || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            color={item.status === 'stolen' ? 'error' : 'warning'}
                                        />
                                    </TableCell>
                                    <TableCell>{item.owner.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleOpenDialog(item)}
                                        >
                                            Voir détails
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Détails de l'objet</DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Informations sur l'objet</Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Typography><strong>Nom:</strong> {selectedItem.name}</Typography>
                                    <Typography><strong>Description:</strong> {selectedItem.description}</Typography>
                                    <Typography><strong>Numéro de série:</strong> {selectedItem.serialNumber || 'N/A'}</Typography>
                                    <Typography><strong>Statut:</strong> {selectedItem.status}</Typography>
                                    <Typography><strong>Date d'enregistrement:</strong> {new Date(selectedItem.createdAt).toLocaleDateString()}</Typography>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Informations sur le propriétaire</Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Typography><strong>Nom:</strong> {selectedItem.owner.name}</Typography>
                                    <Typography><strong>Email:</strong> {selectedItem.owner.email}</Typography>
                                    <Typography><strong>Téléphone:</strong> {selectedItem.owner.phone || 'Non renseigné'}</Typography>
                                    <Typography><strong>Adresse:</strong> {selectedItem.owner.address || 'Non renseignée'}</Typography>
                                </Box>
                            </Grid>

                            {selectedItem.documents && selectedItem.documents.length > 0 && (
                                <Grid item xs={12}>
                                    <Typography variant="h6">Documents associés</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        {selectedItem.documents.map((doc, index) => (
                                            <Box key={index} sx={{ mb: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    href={doc.url}
                                                    target="_blank"
                                                >
                                                    {doc.name || `Document ${index + 1}`}
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AuthorityInterface;

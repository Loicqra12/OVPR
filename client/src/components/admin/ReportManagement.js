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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Chip,
    Box,
    Alert
} from '@mui/material';
import axios from 'axios';

function ReportManagement() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [moderatorNote, setModeratorNote] = useState('');
    const [selectedAction, setSelectedAction] = useState('none');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/admin/reports');
            setReports(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors du chargement des signalements');
            setLoading(false);
        }
    };

    const handleOpenDialog = (report) => {
        setSelectedReport(report);
        setModeratorNote('');
        setSelectedAction('none');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReport(null);
        setModeratorNote('');
        setSelectedAction('none');
    };

    const handleReportUpdate = async () => {
        try {
            await axios.patch(`/api/admin/reports/${selectedReport._id}`, {
                status: 'investigating',
                note: moderatorNote,
                action: selectedAction
            });
            fetchReports(); // Rafraîchir la liste des signalements
            handleCloseDialog();
        } catch (err) {
            setError('Erreur lors de la mise à jour du signalement');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            investigating: 'info',
            resolved: 'success',
            rejected: 'error'
        };
        return colors[status] || 'default';
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Objet concerné</TableCell>
                            <TableCell>Signalé par</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report._id}>
                                <TableCell>
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={report.type}
                                        color={report.type === 'stolen' ? 'error' : 'warning'}
                                    />
                                </TableCell>
                                <TableCell>{report.item?.name || 'Objet supprimé'}</TableCell>
                                <TableCell>{report.reporter?.name}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={report.status}
                                        color={getStatusColor(report.status)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenDialog(report)}
                                    >
                                        Gérer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Gérer le signalement</DialogTitle>
                <DialogContent>
                    {selectedReport && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">Détails du signalement</Typography>
                            <Typography>Type: {selectedReport.type}</Typography>
                            <Typography>Description: {selectedReport.description}</Typography>
                            
                            <Box sx={{ mt: 2 }}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Action</InputLabel>
                                    <Select
                                        value={selectedAction}
                                        onChange={(e) => setSelectedAction(e.target.value)}
                                    >
                                        <MenuItem value="none">Aucune action</MenuItem>
                                        <MenuItem value="warning">Avertissement</MenuItem>
                                        <MenuItem value="suspension">Suspension</MenuItem>
                                        <MenuItem value="deletion">Suppression</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Note du modérateur"
                                    value={moderatorNote}
                                    onChange={(e) => setModeratorNote(e.target.value)}
                                />
                            </Box>

                            {selectedReport.moderatorNotes?.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6">Historique des notes</Typography>
                                    {selectedReport.moderatorNotes.map((note, index) => (
                                        <Box key={index} sx={{ mt: 1, p: 1, bgcolor: 'grey.100' }}>
                                            <Typography variant="caption">
                                                {new Date(note.timestamp).toLocaleString()} - 
                                                {note.moderator?.name}
                                            </Typography>
                                            <Typography>{note.note}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button
                        onClick={handleReportUpdate}
                        color="primary"
                        disabled={!moderatorNote}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ReportManagement;

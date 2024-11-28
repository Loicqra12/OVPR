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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton,
    Tooltip,
    Alert
} from '@mui/material';
import {
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs');
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get('/api/roles');
            setRoles(response.data);
        } catch (err) {
            console.error('Erreur lors du chargement des rôles:', err);
        }
    };

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role._id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setSelectedRole('');
    };

    const handleRoleChange = async () => {
        try {
            await axios.patch(`/api/admin/users/${selectedUser._id}/role`, {
                roleId: selectedRole
            });
            fetchUsers(); // Rafraîchir la liste des utilisateurs
            handleCloseDialog();
        } catch (err) {
            setError('Erreur lors de la modification du rôle');
        }
    };

    const handleUserStatusChange = async (userId, newStatus) => {
        try {
            await axios.patch(`/api/admin/users/${userId}/status`, {
                status: newStatus
            });
            fetchUsers(); // Rafraîchir la liste des utilisateurs
        } catch (err) {
            setError('Erreur lors de la modification du statut');
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rôle</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user._id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role.name}</TableCell>
                                <TableCell>{user.status}</TableCell>
                                <TableCell>
                                    <Tooltip title="Modifier le rôle">
                                        <IconButton
                                            onClick={() => handleOpenDialog(user)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {user.status === 'active' ? (
                                        <Tooltip title="Bloquer l'utilisateur">
                                            <IconButton
                                                onClick={() => handleUserStatusChange(user._id, 'blocked')}
                                                color="error"
                                            >
                                                <BlockIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Activer l'utilisateur">
                                            <IconButton
                                                onClick={() => handleUserStatusChange(user._id, 'active')}
                                                color="success"
                                            >
                                                <CheckCircleIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Modifier le rôle utilisateur</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Rôle</InputLabel>
                        <Select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role._id} value={role._id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button onClick={handleRoleChange} color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UserManagement;

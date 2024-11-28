import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const defaultPermissions = {
  users: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  objects: {
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  transactions: {
    view: false,
    manage: false,
  },
  notifications: {
    view: false,
    send: false,
  },
  settings: {
    view: false,
    edit: false,
  },
};

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editedRole, setEditedRole] = useState({
    name: '',
    description: '',
    permissions: { ...defaultPermissions },
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/roles');
      const data = await response.json();
      if (response.ok) {
        setRoles(data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async () => {
    try {
      const url = selectedRole
        ? `/api/admin/roles/${selectedRole.id}`
        : '/api/admin/roles';
      const method = selectedRole ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRole),
      });

      if (response.ok) {
        setOpenDialog(false);
        fetchRoles();
        setSelectedRole(null);
        setEditedRole({
          name: '',
          description: '',
          permissions: { ...defaultPermissions },
        });
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      try {
        const response = await fetch(`/api/admin/roles/${roleId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchRoles();
        } else {
          const data = await response.json();
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setEditedRole({
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions },
    });
    setOpenDialog(true);
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setEditedRole({
      name: '',
      description: '',
      permissions: { ...defaultPermissions },
    });
    setOpenDialog(true);
  };

  const handlePermissionChange = (category, permission) => {
    setEditedRole({
      ...editedRole,
      permissions: {
        ...editedRole.permissions,
        [category]: {
          ...editedRole.permissions[category],
          [permission]: !editedRole.permissions[category][permission],
        },
      },
    });
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
        <Typography variant="h5">Gestion des rôles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRole}
        >
          Nouveau rôle
        </Button>
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
              <TableCell>Nom du rôle</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <SecurityIcon sx={{ mr: 1 }} />
                    {role.name}
                  </Box>
                </TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {Object.entries(role.permissions).map(([category, perms]) => (
                      Object.entries(perms)
                        .filter(([, value]) => value)
                        .map(([perm]) => (
                          <Chip
                            key={`${category}-${perm}`}
                            label={`${category}:${perm}`}
                            size="small"
                            variant="outlined"
                          />
                        ))
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="Modifier">
                    <IconButton onClick={() => handleEditRole(role)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {role.name !== 'admin' && (
                    <Tooltip title="Supprimer">
                      <IconButton
                        onClick={() => handleDeleteRole(role.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRole ? 'Modifier le rôle' : 'Nouveau rôle'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom du rôle"
            value={editedRole.name}
            onChange={(e) => setEditedRole({ ...editedRole, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={editedRole.description}
            onChange={(e) =>
              setEditedRole({ ...editedRole, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={2}
          />
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Permissions
          </Typography>
          
          {Object.entries(editedRole.permissions).map(([category, permissions]) => (
            <Box key={category} mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Typography>
              <FormGroup>
                {Object.entries(permissions).map(([permission, value]) => (
                  <FormControlLabel
                    key={`${category}-${permission}`}
                    control={
                      <Checkbox
                        checked={value}
                        onChange={() => handlePermissionChange(category, permission)}
                      />
                    }
                    label={permission.charAt(0).toUpperCase() + permission.slice(1)}
                  />
                ))}
              </FormGroup>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={handleSaveRole}
            variant="contained"
            disabled={!editedRole.name}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;

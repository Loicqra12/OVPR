import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Tabs,
    Tab,
    CircularProgress
} from '@mui/material';
import UserManagement from './UserManagement';
import ReportManagement from './ReportManagement';
import AuthorityInterface from './AuthorityInterface';
import Statistics from './Statistics';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

function AdminDashboard() {
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('/api/users/me');
                setUserRole(response.data.role);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des informations utilisateur');
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Tableau de bord d'administration
                        </Typography>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
                                {userRole?.permissions?.includes('manage_users') && (
                                    <Tab label="Gestion des utilisateurs" />
                                )}
                                {userRole?.permissions?.includes('moderate_reports') && (
                                    <Tab label="Gestion des signalements" />
                                )}
                                {userRole?.name === 'authority' && (
                                    <Tab label="Interface autorités" />
                                )}
                                {userRole?.permissions?.includes('view_statistics') && (
                                    <Tab label="Statistiques" />
                                )}
                            </Tabs>
                        </Box>

                        {userRole?.permissions?.includes('manage_users') && (
                            <TabPanel value={value} index={0}>
                                <UserManagement />
                            </TabPanel>
                        )}

                        {userRole?.permissions?.includes('moderate_reports') && (
                            <TabPanel value={value} index={1}>
                                <ReportManagement />
                            </TabPanel>
                        )}

                        {userRole?.name === 'authority' && (
                            <TabPanel value={value} index={2}>
                                <AuthorityInterface />
                            </TabPanel>
                        )}

                        {userRole?.permissions?.includes('view_statistics') && (
                            <TabPanel value={value} index={3}>
                                <Statistics />
                            </TabPanel>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default AdminDashboard;

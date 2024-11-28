import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Statistics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/admin/statistics');
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors du chargement des statistiques');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    const itemStatusData = stats ? [
        { name: 'Actifs', value: stats.items_by_status.active },
        { name: 'Volés', value: stats.items_by_status.stolen },
        { name: 'Perdus', value: stats.items_by_status.lost },
        { name: 'Retrouvés', value: stats.items_by_status.found }
    ] : [];

    const reportData = stats ? [
        { name: 'En attente', value: stats.reports.pending },
        { name: 'Résolus', value: stats.reports.resolved }
    ] : [];

    return (
        <Grid container spacing={3}>
            {/* Statistiques générales */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Vue d'ensemble
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Box textAlign="center">
                                <Typography variant="h4" color="primary">
                                    {stats?.users}
                                </Typography>
                                <Typography>Utilisateurs inscrits</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box textAlign="center">
                                <Typography variant="h4" color="primary">
                                    {stats?.items}
                                </Typography>
                                <Typography>Objets enregistrés</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box textAlign="center">
                                <Typography variant="h4" color="primary">
                                    {stats?.reports.total}
                                </Typography>
                                <Typography>Signalements totaux</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Graphique des statuts d'objets */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Distribution des statuts d'objets
                    </Typography>
                    <Box display="flex" justifyContent="center" sx={{ height: 300 }}>
                        <PieChart width={400} height={300}>
                            <Pie
                                data={itemStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {itemStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Box>
                </Paper>
            </Grid>

            {/* Graphique des signalements */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        État des signalements
                    </Typography>
                    <Box display="flex" justifyContent="center" sx={{ height: 300 }}>
                        <BarChart
                            width={400}
                            height={300}
                            data={reportData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Statistics;

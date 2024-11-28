import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
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
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdvancedStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    userStats: [],
    objectStats: [],
    locationStats: [],
    restitutionStats: [],
    revenueStats: [],
  });

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/statistics?timeRange=${timeRange}`);
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, description }) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Erreur : {error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Statistiques avancées</Typography>
        <FormControl variant="outlined" size="small">
          <InputLabel>Période</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Période"
          >
            <MenuItem value="day">Aujourd'hui</MenuItem>
            <MenuItem value="week">Cette semaine</MenuItem>
            <MenuItem value="month">Ce mois</MenuItem>
            <MenuItem value="year">Cette année</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Cartes de statistiques rapides */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Utilisateurs actifs"
            value={stats.activeUsers}
            description="Utilisateurs actifs ce mois"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Objets déclarés"
            value={stats.totalObjects}
            description="Total des objets déclarés"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Taux de restitution"
            value={`${stats.restitutionRate}%`}
            description="Objets restitués avec succès"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Revenus"
            value={`${stats.totalRevenue}€`}
            description="Revenus totaux générés"
          />
        </Grid>

        {/* Graphiques */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Évolution des objets déclarés
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.objectStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="perdus" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="trouvés" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Répartition géographique
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.locationStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.locationStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenus mensuels
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.revenueStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedStatistics;

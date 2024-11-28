import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  PostAdd as PostAddIcon,
  AttachMoney as AttachMoneyIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
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
} from 'recharts';

const AdminDashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
    fetchAlerts();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/admin/recent-activity');
      const data = await response.json();
      setRecentActivity(data);
    } catch (error) {
      console.error('Erreur lors du chargement des activités récentes:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/admin/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const StatCard = ({ title, value, description }) => (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" color="primary">
        {value}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          {description}
        </Typography>
      )}
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        {/* En-tête */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tableau de bord administrateur
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Exporter les données</MenuItem>
            <MenuItem onClick={handleMenuClose}>Paramètres</MenuItem>
            <MenuItem onClick={handleMenuClose}>Aide</MenuItem>
          </Menu>
        </Box>

        {/* Cartes de statistiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Utilisateurs"
              value={stats?.totalUsers || 0}
              description="Utilisateurs inscrits"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Annonces"
              value={stats?.totalAnnounces || 0}
              description="Total des annonces"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Objets retrouvés"
              value={stats?.resolvedAnnounces || 0}
              description="Annonces résolues"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Signalements"
              value={stats?.totalReports || 0}
              description="Total des signalements"
            />
          </Grid>
        </Grid>

        {/* Graphiques */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Annonces par type
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.announcesByType || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {stats?.announcesByType?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Activité des utilisateurs
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.userActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    name="Nouveaux utilisateurs"
                    stroke="#8884d8"
                  />
                  <Line
                    type="monotone"
                    dataKey="newAnnounces"
                    name="Nouvelles annonces"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Statistiques mensuelles
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.monthlyStats || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lost" name="Objets perdus" fill="#8884d8" />
                  <Bar dataKey="found" name="Objets trouvés" fill="#82ca9d" />
                  <Bar dataKey="stolen" name="Objets volés" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Alertes et notifications */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '400px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
              Alertes
            </Typography>
            <List>
              {alerts.map((alert) => (
                <ListItem key={alert.id}>
                  <ListItemIcon>
                    <WarningIcon />
                  </ListItemIcon>
                  <ListItemText primary={alert.message} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Activité récente */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Activité récente
            </Typography>
            <List>
              {recentActivity.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary={activity.message} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;

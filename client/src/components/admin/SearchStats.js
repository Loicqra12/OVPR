import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getSearchStats } from '../../api/search';
import { Download as DownloadIcon } from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SearchStats = () => {
  const [period, setPeriod] = useState('month');
  const [stats, setStats] = useState({
    topKeywords: [],
    topCategories: [],
    topLocations: [],
    searchesByDay: [],
    statusDistribution: [],
  });

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    try {
      const data = await getSearchStats(period);
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Mot-clé', 'Nombre de recherches'],
      ...stats.topKeywords.map(k => [k.keyword, k.count]),
      [],
      ['Catégorie', 'Nombre de recherches'],
      ...stats.topCategories.map(c => [c.category, c.count]),
      [],
      ['Localisation', 'Nombre de recherches'],
      ...stats.topLocations.map(l => [l.location, l.count]),
    ].map(row => row.join(',')).join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `search_stats_${period}.csv`;
    link.click();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Statistiques de recherche</Typography>
        <Box>
          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Période</InputLabel>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              label="Période"
            >
              <MenuItem value="day">Aujourd'hui</MenuItem>
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportData}
          >
            Exporter
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Graphique des recherches par jour */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Évolution des recherches
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.searchesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Recherches" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribution par statut */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribution par statut
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusDistribution}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {stats.statusDistribution.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top mots-clés */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mots-clés les plus recherchés
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mot-clé</TableCell>
                      <TableCell align="right">Recherches</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topKeywords.map((keyword) => (
                      <TableRow key={keyword.keyword}>
                        <TableCell>{keyword.keyword}</TableCell>
                        <TableCell align="right">{keyword.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top catégories */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Catégories les plus recherchées
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Catégorie</TableCell>
                      <TableCell align="right">Recherches</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topCategories.map((category) => (
                      <TableRow key={category.category}>
                        <TableCell>{category.category}</TableCell>
                        <TableCell align="right">{category.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top localisations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Localisations les plus recherchées
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Localisation</TableCell>
                      <TableCell align="right">Recherches</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topLocations.map((location) => (
                      <TableRow key={location.location}>
                        <TableCell>{location.location}</TableCell>
                        <TableCell align="right">{location.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchStats;

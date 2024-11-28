import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondary,
  Chip,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import {
  FindInPage as LostIcon,
  GppGood as FoundIcon,
  Warning as StolenIcon,
  Archive as SoldIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Composant TabPanel pour afficher le contenu de chaque onglet
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`item-history-tabpanel-${index}`}
      aria-labelledby={`item-history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ItemHistory = () => {
  const [value, setValue] = useState(0);
  const [items, setItems] = useState({
    lost: [],
    found: [],
    stolen: [],
    sold: []
  });

  useEffect(() => {
    // Simuler le chargement des données depuis l'API
    const mockData = {
      lost: [
        {
          id: 1,
          name: 'iPhone 13',
          date: '2024-02-15',
          location: 'Abidjan, Cocody',
          status: 'En cours',
          description: 'Perdu près du centre commercial'
        }
      ],
      found: [
        {
          id: 2,
          name: 'Portefeuille',
          date: '2024-02-10',
          location: 'Abidjan, Plateau',
          status: 'Restitué',
          description: 'Trouvé à la banque'
        }
      ],
      stolen: [
        {
          id: 3,
          name: 'Ordinateur portable',
          date: '2024-02-01',
          location: 'Abidjan, Yopougon',
          status: 'Signalé',
          description: "Vol à l'arrachée"
        }
      ],
      sold: [
        {
          id: 4,
          name: 'Tablette Samsung',
          date: '2024-01-20',
          location: 'En ligne',
          status: 'Vendu',
          description: 'Vendu sur marketplace'
        }
      ]
    };

    setItems(mockData);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getStatusChip = (status) => {
    const statusColors = {
      'En cours': 'warning',
      'Restitué': 'success',
      'Signalé': 'error',
      'Vendu': 'default'
    };

    return (
      <Chip
        label={status}
        color={statusColors[status] || 'default'}
        size="small"
      />
    );
  };

  const getIcon = (category) => {
    const icons = {
      lost: <LostIcon color="warning" />,
      found: <FoundIcon color="success" />,
      stolen: <StolenIcon color="error" />,
      sold: <SoldIcon color="action" />
    };
    return icons[category];
  };

  const renderItemList = (itemList, category) => (
    <List>
      {itemList.map((item) => (
        <Paper
          key={item.id}
          elevation={1}
          sx={{ mb: 2, '&:hover': { backgroundColor: 'action.hover' } }}
        >
          <ListItem
            secondaryAction={
              <Box>
                <Tooltip title="Modifier">
                  <IconButton edge="end" aria-label="modifier" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <IconButton edge="end" aria-label="supprimer">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemIcon>
              {getIcon(category)}
            </ListItemIcon>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <ListItemText
                  primary={item.name}
                  secondary={format(new Date(item.date), 'dd MMMM yyyy', { locale: fr })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ListItemText
                  primary={item.location}
                  secondary={item.description}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent="flex-end">
                  {getStatusChip(item.status)}
                </Box>
              </Grid>
            </Grid>
          </ListItem>
        </Paper>
      ))}
    </List>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Historique des Objets
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Perdus" icon={<LostIcon />} />
          <Tab label="Retrouvés" icon={<FoundIcon />} />
          <Tab label="Volés" icon={<StolenIcon />} />
          <Tab label="Vendus/Donnés" icon={<SoldIcon />} />
        </Tabs>

        <TabPanel value={value} index={0}>
          {renderItemList(items.lost, 'lost')}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {renderItemList(items.found, 'found')}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {renderItemList(items.stolen, 'stolen')}
        </TabPanel>
        <TabPanel value={value} index={3}>
          {renderItemList(items.sold, 'sold')}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ItemHistory;

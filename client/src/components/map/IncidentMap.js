import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Box, Typography, Paper, Chip, IconButton, Fab, Tooltip, Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Warning as WarningIcon,
  MyLocation as MyLocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Layers as LayersIcon
} from '@mui/icons-material';

// Styles personnalisés
const MapWrapper = styled(Box)(({ theme }) => ({
  height: '70vh',
  width: '100%',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
  },
}));

const Legend = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  padding: theme.spacing(2),
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const ControlButton = styled(Fab)(({ theme }) => ({
  position: 'absolute',
  zIndex: 1000,
  margin: theme.spacing(2),
}));

// Configuration des niveaux de risque avec plus de détails
const riskLevels = {
  critical: { 
    color: '#d32f2f',
    radius: 600,
    label: 'Zone critique',
    description: 'Plus de 10 incidents signalés'
  },
  high: { 
    color: '#f44336',
    radius: 500,
    label: 'Zone à haut risque',
    description: '5-10 incidents signalés'
  },
  medium: { 
    color: '#ff9800',
    radius: 400,
    label: 'Zone à risque modéré',
    description: '2-5 incidents signalés'
  },
  low: { 
    color: '#ffd700',
    radius: 300,
    label: 'Zone à faible risque',
    description: '1-2 incidents signalés'
  },
};

const defaultCenter = [14.7167, -17.4677]; // Dakar

// Composant pour les contrôles de zoom
const ZoomControl = ({ position = 'topleft' }) => {
  const map = useMap();

  return (
    <Box sx={{ position: 'absolute', [position]: 16, zIndex: 1000 }}>
      <Tooltip title="Zoom avant">
        <Fab
          size="small"
          color="primary"
          sx={{ mb: 1 }}
          onClick={() => map.zoomIn()}
        >
          <ZoomInIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Zoom arrière">
        <Fab
          size="small"
          color="primary"
          onClick={() => map.zoomOut()}
        >
          <ZoomOutIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};

// Composant pour le recentrage automatique
const LocationMarker = () => {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
      watch: true,
      timeout: 5000
    });

    map.on('locationfound', (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 16, {
        duration: 1
      });
    });

    map.on('locationerror', (e) => {
      console.error('Erreur de localisation:', e.message);
    });

    return () => {
      map.stopLocate();
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <Typography variant="subtitle2">Votre position</Typography>
        <Typography variant="body2" color="text.secondary">
          Mise à jour en temps réel
        </Typography>
      </Popup>
    </Marker>
  );
};

// Composant principal
const IncidentMap = () => {
  const [incidents, setIncidents] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [mapInstance, setMapInstance] = useState(null);

  // Charger les données des incidents (simulation)
  useEffect(() => {
    const mockIncidents = [
      {
        id: 1,
        location: [14.7167, -17.4677],
        type: 'Agression',
        date: '2023-11-27',
        description: 'Agression physique signalée',
        severity: 'high',
        time: '22:30',
        details: 'Incident survenu près de la station de bus'
      },
      {
        id: 2,
        location: [14.7267, -17.4577],
        type: 'Vol',
        date: '2023-11-26',
        description: 'Vol à l\'arraché',
        severity: 'medium',
        time: '18:45',
        details: 'Vol de téléphone portable'
      },
      {
        id: 3,
        location: [14.7367, -17.4677],
        type: 'Harcèlement',
        date: '2023-11-27',
        description: 'Harcèlement de rue',
        severity: 'low',
        time: '16:20',
        details: 'Signalement de harcèlement verbal'
      },
      {
        id: 4,
        location: [14.7167, -17.4577],
        type: 'Agression',
        date: '2023-11-25',
        description: 'Tentative d\'agression',
        severity: 'critical',
        time: '23:15',
        details: 'Zone peu éclairée, présence suspecte'
      }
    ];

    setIncidents(mockIncidents);
  }, []);

  // Géolocalisation avec gestion d'erreur améliorée
  const handleLocationClick = useCallback(() => {
    if (!navigator.geolocation) {
      setAlertMessage('La géolocalisation n\'est pas supportée par votre navigateur');
      setShowAlert(true);
      return;
    }

    if (mapInstance) {
      mapInstance.locate({
        setView: true,
        maxZoom: 16,
        enableHighAccuracy: true
      });
    }
  }, [mapInstance]);

  return (
    <MapWrapper>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMapInstance}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <ZoomControl />
        <LocationMarker />

        {/* Marqueurs des incidents avec cercles de risque */}
        {incidents.map((incident) => (
          <React.Fragment key={incident.id}>
            <Marker position={incident.location}>
              <Popup>
                <Typography variant="subtitle1" color="primary">
                  {incident.type}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Date: {incident.date} à {incident.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {incident.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {incident.details}
                </Typography>
                <Chip
                  size="small"
                  icon={<WarningIcon />}
                  label={riskLevels[incident.severity].label}
                  color="error"
                  sx={{ mt: 1 }}
                />
              </Popup>
            </Marker>
            <Circle
              center={incident.location}
              radius={riskLevels[incident.severity].radius}
              pathOptions={{
                color: riskLevels[incident.severity].color,
                fillColor: riskLevels[incident.severity].color,
                fillOpacity: 0.2,
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Bouton de géolocalisation */}
      <Tooltip title="Ma position">
        <ControlButton
          size="small"
          color="primary"
          onClick={handleLocationClick}
          sx={{ top: 16, right: 16 }}
        >
          <MyLocationIcon />
        </ControlButton>
      </Tooltip>

      {/* Légende améliorée */}
      <Legend>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LayersIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle2">
            Niveaux de risque
          </Typography>
        </Box>
        {Object.entries(riskLevels).map(([key, value]) => (
          <Box key={key} sx={{ mb: 1 }}>
            <Chip
              icon={<WarningIcon style={{ color: value.color }} />}
              label={value.label}
              size="small"
              sx={{ mb: 0.5 }}
            />
            <Typography variant="caption" display="block" color="text.secondary">
              {value.description}
            </Typography>
          </Box>
        ))}
      </Legend>

      {/* Notifications */}
      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </MapWrapper>
  );
};

export default IncidentMap;

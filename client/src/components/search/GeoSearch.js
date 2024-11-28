import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Slider,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
    Alert,
} from '@mui/material';
import {
    MyLocation as MyLocationIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import axios from 'axios';

const GeoSearch = ({ onSearch }) => {
    const [location, setLocation] = useState(null);
    const [radius, setRadius] = useState(5);
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Obtenir la localisation actuelle
    const getCurrentLocation = () => {
        setLoading(true);
        setError('');

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    try {
                        // Reverse geocoding avec l'API Nominatim (OpenStreetMap)
                        const response = await axios.get(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );

                        setLocation({
                            latitude,
                            longitude,
                            address: response.data.display_name,
                            city: response.data.address.city || response.data.address.town,
                            postalCode: response.data.address.postcode
                        });
                        setAddress(response.data.display_name);
                    } catch (error) {
                        console.error('Erreur de géocodage inverse:', error);
                        setLocation({ latitude, longitude });
                        setAddress(`${latitude}, ${longitude}`);
                    }
                    
                    setLoading(false);
                },
                (error) => {
                    setLoading(false);
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            setError("Vous devez autoriser l'accès à votre position");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setError("Position non disponible");
                            break;
                        case error.TIMEOUT:
                            setError("Délai d'attente dépassé");
                            break;
                        default:
                            setError("Une erreur est survenue");
                    }
                }
            );
        } else {
            setLoading(false);
            setError("La géolocalisation n'est pas supportée par votre navigateur");
        }
    };

    // Recherche d'adresse avec l'API Nominatim
    const searchAddress = async (query) => {
        if (!query) return;
        
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );

            if (response.data && response.data[0]) {
                const result = response.data[0];
                setLocation({
                    latitude: parseFloat(result.lat),
                    longitude: parseFloat(result.lon),
                    address: result.display_name,
                    city: result.address?.city || result.address?.town,
                    postalCode: result.address?.postcode
                });
                setAddress(result.display_name);
            } else {
                setError("Aucun résultat trouvé pour cette adresse");
            }
        } catch (error) {
            console.error('Erreur de géocodage:', error);
            setError("Erreur lors de la recherche de l'adresse");
        }

        setLoading(false);
    };

    // Effectuer la recherche
    const handleSearch = () => {
        if (!location) {
            setError("Veuillez d'abord définir une localisation");
            return;
        }

        onSearch({
            location: {
                coordinates: {
                    latitude: location.latitude,
                    longitude: location.longitude
                },
                address: location.address,
                city: location.city,
                postalCode: location.postalCode,
                radius
            }
        });
    };

    // Réinitialiser la recherche
    const handleReset = () => {
        setLocation(null);
        setRadius(5);
        setAddress('');
        setError('');
    };

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Recherche par localisation
                        </Typography>
                    </Grid>

                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                label="Adresse"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onBlur={() => searchAddress(address)}
                                disabled={loading}
                            />
                            <IconButton 
                                onClick={getCurrentLocation}
                                disabled={loading}
                                color="primary"
                            >
                                <MyLocationIcon />
                            </IconButton>
                        </Box>
                    </Grid>

                    {location && (
                        <>
                            <Grid item xs={12}>
                                <Typography gutterBottom>
                                    Rayon de recherche : {radius} km
                                </Typography>
                                <Slider
                                    value={radius}
                                    onChange={(_, value) => setRadius(value)}
                                    min={1}
                                    max={50}
                                    marks={[
                                        { value: 1, label: '1km' },
                                        { value: 10, label: '10km' },
                                        { value: 25, label: '25km' },
                                        { value: 50, label: '50km' }
                                    ]}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Chip
                                    label={`${location.city || 'Ville inconnue'} (${location.postalCode || 'Code postal inconnu'})`}
                                    onDelete={handleReset}
                                    color="primary"
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                startIcon={<ClearIcon />}
                            >
                                Réinitialiser
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                startIcon={<SearchIcon />}
                                disabled={!location || loading}
                            >
                                Rechercher
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default GeoSearch;

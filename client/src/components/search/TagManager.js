import React, { useState, useEffect } from 'react';
import {
    Box,
    Chip,
    TextField,
    Autocomplete,
    Typography,
    Paper
} from '@mui/material';
import axios from 'axios';

const TagManager = ({ value = [], onChange, suggestions = [], maxTags = 10 }) => {
    const [inputValue, setInputValue] = useState('');
    const [availableTags, setAvailableTags] = useState(suggestions);

    useEffect(() => {
        // Charger les suggestions de tags depuis le serveur
        const loadTagSuggestions = async () => {
            try {
                const response = await axios.get('/api/tags/suggestions');
                setAvailableTags(response.data.tags);
            } catch (error) {
                console.error('Erreur lors du chargement des tags:', error);
            }
        };

        if (suggestions.length === 0) {
            loadTagSuggestions();
        }
    }, [suggestions]);

    const handleTagAdd = (newTag) => {
        if (!newTag || value.length >= maxTags) return;

        const normalizedTag = newTag.toLowerCase().trim();
        
        if (normalizedTag && !value.includes(normalizedTag)) {
            const newTags = [...value, normalizedTag];
            onChange(newTags);
            setInputValue('');
        }
    };

    const handleTagDelete = (tagToDelete) => {
        const newTags = value.filter(tag => tag !== tagToDelete);
        onChange(newTags);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && inputValue) {
            event.preventDefault();
            handleTagAdd(inputValue);
        }
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Tags ({value.length}/{maxTags})
            </Typography>
            
            <Autocomplete
                multiple
                id="tags-filled"
                options={availableTags.filter(tag => !value.includes(tag))}
                value={value}
                onChange={(event, newValue) => {
                    onChange(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                freeSolo
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            key={option}
                            label={option}
                            {...getTagProps({ index })}
                            onDelete={() => handleTagDelete(option)}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder={value.length >= maxTags ? "" : "Ajouter un tag"}
                        onKeyPress={handleKeyPress}
                        helperText={`Appuyez sur Entrée pour ajouter un tag (${maxTags - value.length} restants)`}
                    />
                )}
            />

            {availableTags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Tags suggérés
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {availableTags
                            .filter(tag => !value.includes(tag))
                            .slice(0, 10)
                            .map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onClick={() => handleTagAdd(tag)}
                                    variant="outlined"
                                    size="small"
                                />
                            ))
                        }
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default TagManager;

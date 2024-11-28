import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  ImageList,
  ImageListItem,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
  Edit as EditIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const ImageUploader = ({ images = [], onChange, maxImages = 10, maxSize = 5242880 }) => { // 5MB par défaut
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (images.length + acceptedFiles.length > maxImages) {
            setError(`Vous ne pouvez pas télécharger plus de ${maxImages} images`);
            return;
        }

        setUploading(true);
        setError('');
        setUploadProgress(0);

        try {
            const newImages = await Promise.all(
                acceptedFiles.map(async (file, index) => {
                    // Vérification de la taille
                    if (file.size > maxSize) {
                        throw new Error(`L'image ${file.name} dépasse la taille maximale de ${maxSize / 1024 / 1024}MB`);
                    }

                    // Simuler une progression de téléchargement
                    const progress = ((index + 1) / acceptedFiles.length) * 100;
                    setUploadProgress(progress);

                    // Création d'une URL temporaire pour la prévisualisation
                    const previewUrl = URL.createObjectURL(file);

                    // Ici, vous pouvez ajouter la logique pour télécharger l'image vers votre serveur
                    // const formData = new FormData();
                    // formData.append('image', file);
                    // const response = await axios.post('/api/upload', formData);
                    // return response.data.url;

                    return {
                        url: previewUrl,
                        file,
                        alt: file.name,
                        title: file.name,
                        description: ''
                    };
                })
            );

            onChange([...images, ...newImages]);
        } catch (error) {
            setError(error.message);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }, [images, maxImages, maxSize, onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxSize,
    });

    const handleDelete = (index) => {
        const newImages = [...images];
        const removedImage = newImages.splice(index, 1)[0];
        
        // Libération de l'URL temporaire
        if (removedImage.url.startsWith('blob:')) {
            URL.revokeObjectURL(removedImage.url);
        }

        onChange(newImages);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newImages = Array.from(images);
        const [reorderedImage] = newImages.splice(result.source.index, 1);
        newImages.splice(result.destination.index, 0, reorderedImage);

        onChange(newImages);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setOpenPreview(true);
    };

    const handleEditImageInfo = (index, newTitle, newDescription) => {
        const newImages = [...images];
        newImages[index] = {
            ...newImages[index],
            title: newTitle,
            description: newDescription
        };
        onChange(newImages);
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                }}
            >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                    Glissez-déposez vos images ici
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ou cliquez pour sélectionner des fichiers
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {`Formats acceptés: JPG, PNG, GIF (max ${maxSize / 1024 / 1024}MB)`}
                </Typography>
            </Box>

            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {uploading && (
                <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="caption" sx={{ mt: 1 }}>
                        {`Téléchargement en cours... ${Math.round(uploadProgress)}%`}
                    </Typography>
                </Box>
            )}

            <Typography variant="subtitle1" gutterBottom>
                {`Images (${images.length}/${maxImages})`}
            </Typography>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                        <ImageList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{ width: '100%', height: 'auto' }}
                            cols={4}
                            rowHeight={200}
                            gap={8}
                        >
                            {images.map((image, index) => (
                                <Draggable key={index} draggableId={`image-${index}`} index={index}>
                                    {(provided, snapshot) => (
                                        <ImageListItem
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            sx={{
                                                cursor: 'move',
                                                opacity: snapshot.isDragging ? 0.5 : 1,
                                                position: 'relative',
                                                '&:hover .image-actions': {
                                                    opacity: 1,
                                                },
                                            }}
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.alt || `Image ${index + 1}`}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <Box
                                                className="image-actions"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    left: 0,
                                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Voir l'image">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleImageClick(image)}
                                                            sx={{ color: 'white' }}
                                                        >
                                                            <ZoomInIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Modifier les informations">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditImageInfo(index)}
                                                            sx={{ color: 'white' }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Supprimer">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDelete(index)}
                                                            sx={{ color: 'white' }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                                <div {...provided.dragHandleProps}>
                                                    <Tooltip title="Déplacer">
                                                        <DragHandleIcon sx={{ color: 'white' }} />
                                                    </Tooltip>
                                                </div>
                                            </Box>
                                        </ImageListItem>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ImageList>
                    )}
                </Droppable>
            </DragDropContext>

            <Dialog
                open={openPreview}
                onClose={() => setOpenPreview(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedImage && (
                    <>
                        <DialogTitle>
                            {selectedImage.title || 'Aperçu de l\'image'}
                        </DialogTitle>
                        <DialogContent>
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.alt}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '70vh',
                                    objectFit: 'contain',
                                }}
                            />
                            {selectedImage.description && (
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    {selectedImage.description}
                                </Typography>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenPreview(false)}>
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Paper>
    );
};

export default ImageUploader;

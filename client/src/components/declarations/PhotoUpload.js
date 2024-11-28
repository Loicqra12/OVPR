import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  styled,
  Paper
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const DropzoneArea = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.dark,
  },
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 8,
});

const PhotoUpload = ({ photos, setPhotos, maxPhotos = 4 }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const newPhotos = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPhotos(prevPhotos => {
      const updatedPhotos = [...prevPhotos, ...newPhotos].slice(0, maxPhotos);
      return updatedPhotos;
    });
  }, [maxPhotos, setPhotos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880, // 5MB
    maxFiles: maxPhotos,
  });

  const removePhoto = (index) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {photos.length < maxPhotos && (
        <DropzoneArea {...getRootProps()}>
          <input {...getInputProps()} />
          <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Déposez les photos ici' : 'Glissez-déposez vos photos ici'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            ou cliquez pour sélectionner des fichiers
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Format acceptés : JPG, PNG • Max {maxPhotos} photos • 5MB max par photo
          </Typography>
        </DropzoneArea>
      )}

      {photos.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {photos.map((photo, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  '&:hover .delete-button': {
                    opacity: 1,
                  },
                }}
              >
                <PreviewImage
                  src={photo.preview}
                  alt={`Preview ${index + 1}`}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
                <IconButton
                  className="delete-button"
                  size="small"
                  onClick={() => removePhoto(index)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PhotoUpload;

import React, { useState, useRef } from 'react';
import { Box, Grid, useTheme, useMediaQuery } from '@mui/material';

const ProductGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setIsZooming(false);
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current || !isZooming) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  if (!images || images.length === 0) {
    return (
      <Box
        component="img"
        src="/placeholder-image.jpg"
        alt="Image non disponible"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <Grid container spacing={2} sx={{ height: '100%' }}>
      {/* Colonne des miniatures */}
      <Grid
        item
        xs={12}
        sm={2}
        sx={{
          order: { xs: 2, sm: 1 },
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'column' },
          gap: 2,
          overflowX: { xs: 'auto', sm: 'hidden' },
          overflowY: { xs: 'hidden', sm: 'auto' },
          maxHeight: { xs: '100px', sm: '600px' },
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
            '&:hover': {
              background: '#555',
            },
          },
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            onClick={() => handleImageSelect(image)}
            sx={{
              width: { xs: '80px', sm: '100%' },
              height: { xs: '80px', sm: '100px' },
              flexShrink: 0,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: selectedImage === image ? 'primary.main' : 'transparent',
              borderRadius: 1,
              overflow: 'hidden',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <img
              src={image.url}
              alt={image.alt || `Miniature ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </Box>
        ))}
      </Grid>

      {/* Image principale avec effet de zoom */}
      <Grid
        item
        xs={12}
        sm={10}
        sx={{
          order: { xs: 1, sm: 2 },
          height: { xs: '300px', sm: '600px' },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 1,
            cursor: isZooming ? 'none' : 'zoom-in',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          ref={imageRef}
        >
          {/* Image principale */}
          <Box
            component="img"
            src={selectedImage?.url || images[0]?.url}
            alt={selectedImage?.alt || 'Image principale'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />

          {/* Effet de zoom */}
          {isZooming && !isMobile && (
            <>
              {/* Zone zoomée */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 1,
                  pointerEvents: 'none',
                  backgroundImage: `url(${selectedImage?.url || images[0]?.url})`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '200%',
                  transition: 'background-position 0.1s ease-out',
                }}
              />

              {/* Curseur personnalisé */}
              <Box
                sx={{
                  position: 'absolute',
                  top: `${zoomPosition.y}%`,
                  left: `${zoomPosition.x}%`,
                  width: '100px',
                  height: '100px',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid white',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '2px',
                    height: '2px',
                    backgroundColor: 'white',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
                  },
                }}
              />
            </>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductGallery;

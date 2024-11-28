import React, { useState } from 'react';
import {
    Box,
    IconButton,
    ImageList,
    ImageListItem,
    Modal,
    Paper,
    Typography,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

const ImageGallery = ({ images = [] }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomModalOpen, setZoomModalOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleImageClick = (image, index) => {
        setSelectedImage(image);
        setCurrentIndex(index);
        setZoomModalOpen(true);
    };

    const handleCloseZoom = () => {
        setZoomModalOpen(false);
        setShowInfo(false);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        setSelectedImage(images[currentIndex > 0 ? currentIndex - 1 : images.length - 1]);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        setSelectedImage(images[currentIndex < images.length - 1 ? currentIndex + 1 : 0]);
    };

    // Si aucune image n'est fournie ou si le tableau est vide
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
        <Box sx={{ width: '100%', mb: 2 }}>
            {/* Liste des miniatures */}
            <ImageList
                sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '300px',
                }}
                cols={isMobile ? 2 : 3}
                rowHeight={isMobile ? 120 : 164}
            >
                {images.map((image, index) => (
                    <ImageListItem 
                        key={index}
                        onClick={() => handleImageClick(image, index)}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: 0.8,
                            }
                        }}
                    >
                        <img
                            src={image.url}
                            alt={image.alt || 'Image'}
                            loading="lazy"
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
                    </ImageListItem>
                ))}
            </ImageList>

            {/* Modal de zoom */}
            <Modal
                open={zoomModalOpen}
                onClose={handleCloseZoom}
                closeAfterTransition
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.9)',
                }}
            >
                <Fade in={zoomModalOpen}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: '90vw',
                            height: '90vh',
                            bgcolor: 'transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedImage && (
                            <>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        zIndex: 2,
                                        display: 'flex',
                                        gap: 1,
                                    }}
                                >
                                    <IconButton
                                        onClick={() => setShowInfo(!showInfo)}
                                        sx={{ color: 'white' }}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={handleCloseZoom}
                                        sx={{ color: 'white' }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                <TransformWrapper
                                    initialScale={1}
                                    initialPositionX={0}
                                    initialPositionY={0}
                                >
                                    {({ zoomIn, zoomOut, resetTransform }) => (
                                        <>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    left: 16,
                                                    zIndex: 2,
                                                    display: 'flex',
                                                    gap: 1,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    borderRadius: 1,
                                                    padding: 0.5,
                                                }}
                                            >
                                                <IconButton size="small" onClick={() => zoomIn()} sx={{ color: 'white' }}>
                                                    <ZoomInIcon />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => zoomOut()} sx={{ color: 'white' }}>
                                                    <ZoomOutIcon />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => resetTransform()} sx={{ color: 'white' }}>
                                                    <RestartAltIcon />
                                                </IconButton>
                                            </Box>

                                            <TransformComponent>
                                                <img
                                                    src={selectedImage.url}
                                                    alt={selectedImage.alt || 'Image'}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '80vh',
                                                        objectFit: 'contain',
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder-image.jpg';
                                                    }}
                                                />
                                            </TransformComponent>
                                        </>
                                    )}
                                </TransformWrapper>

                                {showInfo && selectedImage.title && (
                                    <Paper
                                        sx={{
                                            position: 'absolute',
                                            bottom: 16,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            padding: 2,
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            color: 'white',
                                            maxWidth: '80%',
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {selectedImage.title}
                                        </Typography>
                                    </Paper>
                                )}

                                {images.length > 1 && (
                                    <>
                                        <IconButton
                                            onClick={handlePrevious}
                                            sx={{
                                                position: 'absolute',
                                                left: 16,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                },
                                            }}
                                        >
                                            <NavigateBeforeIcon />
                                        </IconButton>

                                        <IconButton
                                            onClick={handleNext}
                                            sx={{
                                                position: 'absolute',
                                                right: 16,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                },
                                            }}
                                        >
                                            <NavigateNextIcon />
                                        </IconButton>

                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: showInfo ? 80 : 16,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                display: 'flex',
                                                gap: 1,
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                padding: '4px 8px',
                                                borderRadius: 1,
                                            }}
                                        >
                                            {images.map((_, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => {
                                                        setCurrentIndex(index);
                                                        setSelectedImage(images[index]);
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default ImageGallery;

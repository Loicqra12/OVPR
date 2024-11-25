const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'receipt') {
            cb(null, 'uploads/receipts');
        } else if (file.fieldname === 'images') {
            cb(null, 'uploads/images');
        } else {
            cb(null, 'uploads');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtre des fichiers
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'receipt') {
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'image/jpeg' || 
            file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Format de fichier non supporté. Utilisez PDF, JPEG ou PNG.'), false);
        }
    } else if (file.fieldname === 'images') {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Format d\'image non supporté. Utilisez JPEG ou PNG.'), false);
        }
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

module.exports = upload;

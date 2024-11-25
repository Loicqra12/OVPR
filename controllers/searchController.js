const Item = require('../models/Item');

// Fonction utilitaire pour construire la requête de recherche
const buildSearchQuery = (filters) => {
    const query = {};

    if (filters.keyword) {
        const keywordRegex = new RegExp(filters.keyword, 'i');
        query.$or = [
            { name: keywordRegex },
            { description: keywordRegex },
            { serialNumber: keywordRegex }
        ];
    }

    if (filters.category) {
        query.category = filters.category;
    }

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        if (start && end) {
            query.purchaseDate = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        }
    }

    // Filtre par localisation si les coordonnées sont fournies
    if (filters.location && filters.location.coordinates && filters.location.radius) {
        const { coordinates, radius } = filters.location;
        query.location = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [coordinates.longitude, coordinates.latitude]
                },
                $maxDistance: radius * 1000 // Conversion en mètres
            }
        };
    }

    return query;
};

// Recherche avancée avec filtres
exports.advancedSearch = async (req, res) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;
        const query = buildSearchQuery(filters);

        const [items, total] = await Promise.all([
            Item.find(query)
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .populate('owner', 'username email')
                .sort('-purchaseDate'),
            Item.countDocuments(query)
        ]);

        // Transformer les items pour la réponse publique
        const publicItems = items.map(item => item.toPublicJSON(req.user));

        res.json({
            items: publicItems,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la recherche'
        });
    }
};

// Recherche rapide (utilisée sur la page d'accueil)
exports.quickSearch = async (req, res) => {
    try {
        const { keyword, location } = req.query;
        const query = {
            $or: [
                { name: new RegExp(keyword, 'i') },
                { description: new RegExp(keyword, 'i') },
                { serialNumber: new RegExp(keyword, 'i') }
            ],
            status: { $in: ['lost', 'found'] }
        };

        // Ajouter le filtre de localisation si disponible
        if (location && location.coordinates) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [location.coordinates.longitude, location.coordinates.latitude]
                    },
                    $maxDistance: 5000 // Rayon par défaut de 5km
                }
            };
        }

        const items = await Item.find(query)
            .limit(10)
            .populate('owner', 'username email')
            .sort('-purchaseDate');

        res.json({
            items: items.map(item => item.toPublicJSON(req.user))
        });
    } catch (error) {
        console.error('Erreur lors de la recherche rapide:', error);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la recherche rapide'
        });
    }
};

// Suggestions de recherche
exports.searchSuggestions = async (req, res) => {
    try {
        const { keyword } = req.query;
        const regex = new RegExp(keyword, 'i');

        const suggestions = await Item.aggregate([
            {
                $match: {
                    $or: [
                        { name: regex },
                        { description: regex },
                        { category: regex }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    names: { $addToSet: '$name' },
                    categories: { $addToSet: '$category' }
                }
            },
            {
                $project: {
                    suggestions: {
                        $concatArrays: ['$names', '$categories']
                    }
                }
            }
        ]);

        res.json({
            suggestions: suggestions.length > 0 ? suggestions[0].suggestions : []
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des suggestions:', error);
        res.status(500).json({
            error: 'Une erreur est survenue lors de la récupération des suggestions'
        });
    }
};

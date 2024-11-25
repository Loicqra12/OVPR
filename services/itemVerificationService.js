const Item = require('../models/Item');
const ItemTrace = require('../models/ItemTrace');
const NotificationService = require('./notificationService');

class ItemVerificationService {
    /**
     * Vérifie le statut d'un objet par son numéro de série ou VIN
     */
    static async verifyItem(identifier, type = 'serialNumber') {
        try {
            let query = {};
            if (type === 'vin') {
                query['vehicleDetails.vin'] = identifier;
            } else {
                query.serialNumber = identifier;
            }

            const item = await Item.findOne(query).populate('owner', 'firstName lastName email');
            if (!item) {
                return {
                    status: 'unknown',
                    message: 'Objet non trouvé dans la base de données'
                };
            }

            // Récupérer l'historique complet
            const traces = await ItemTrace.find({ item: item._id })
                .sort({ date: -1 })
                .populate('actor', 'firstName lastName role')
                .populate('verifiedBy', 'firstName lastName role')
                .populate('details.previousOwner', 'firstName lastName')
                .populate('details.newOwner', 'firstName lastName');

            // Analyser l'historique pour détecter des anomalies
            const analysis = this.analyzeHistory(item, traces);

            // Créer une nouvelle trace de vérification
            await ItemTrace.create({
                item: item._id,
                type: 'verification',
                actor: item.owner._id, // ou l'ID de l'utilisateur qui fait la vérification
                actorType: 'system',
                details: {
                    verificationResult: {
                        status: analysis.status,
                        notes: analysis.message
                    }
                }
            });

            return {
                status: analysis.status,
                message: analysis.message,
                item: {
                    id: item._id,
                    name: item.name,
                    type: item.type,
                    status: item.status,
                    serialNumber: item.serialNumber,
                    vehicleDetails: item.vehicleDetails
                },
                history: traces.map(trace => ({
                    type: trace.type,
                    date: trace.date,
                    actor: {
                        name: `${trace.actor.firstName} ${trace.actor.lastName}`,
                        role: trace.actor.role
                    },
                    details: trace.details
                }))
            };
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'objet:', error);
            throw new Error('Erreur lors de la vérification de l\'objet');
        }
    }

    /**
     * Analyse l'historique d'un objet pour détecter des anomalies
     */
    static analyzeHistory(item, traces) {
        if (item.status === 'stolen') {
            return {
                status: 'stolen',
                message: 'Cet objet a été signalé comme volé'
            };
        }

        // Vérifier les changements de propriétaire suspects
        const ownerChanges = traces.filter(t => t.type === 'transfer').length;
        if (ownerChanges > 3 && item.createdAt > Date.now() - 30 * 24 * 60 * 60 * 1000) { // 30 jours
            return {
                status: 'suspicious',
                message: 'Changements de propriétaire fréquents détectés'
            };
        }

        // Vérifier les signalements précédents
        const previousThefts = traces.filter(t => t.type === 'theft').length;
        if (previousThefts > 0) {
            return {
                status: 'reported',
                message: 'Cet objet a déjà été signalé comme volé dans le passé'
            };
        }

        // Vérifier la cohérence des documents
        const hasValidDocuments = traces.some(t => 
            t.details.documents && 
            t.details.documents.some(d => d.verified)
        );

        if (!hasValidDocuments) {
            return {
                status: 'suspicious',
                message: 'Aucun document vérifié trouvé pour cet objet'
            };
        }

        return {
            status: 'clean',
            message: 'Aucune anomalie détectée'
        };
    }

    /**
     * Vérifie un lot d'objets pour une recherche proactive
     */
    static async batchVerifyItems(identifiers) {
        const results = [];
        for (const identifier of identifiers) {
            try {
                const result = await this.verifyItem(identifier.value, identifier.type);
                results.push({
                    identifier: identifier.value,
                    ...result
                });
            } catch (error) {
                results.push({
                    identifier: identifier.value,
                    status: 'error',
                    message: error.message
                });
            }
        }
        return results;
    }

    /**
     * Enregistre un transfert de propriété
     */
    static async recordTransfer(itemId, previousOwnerId, newOwnerId, documents) {
        const item = await Item.findById(itemId);
        if (!item) {
            throw new Error('Objet non trouvé');
        }

        // Créer une trace de transfert
        const trace = await ItemTrace.create({
            item: itemId,
            type: 'transfer',
            actor: newOwnerId,
            actorType: 'user',
            details: {
                previousOwner: previousOwnerId,
                newOwner: newOwnerId,
                documents: documents.map(doc => ({
                    type: doc.type,
                    url: doc.url,
                    verified: false
                }))
            }
        });

        // Mettre à jour le propriétaire de l'objet
        item.owner = newOwnerId;
        await item.save();

        // Notifier les parties concernées
        await NotificationService.createTransferNotification(item, previousOwnerId, newOwnerId);

        return trace;
    }
}

module.exports = ItemVerificationService;

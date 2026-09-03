const deliveryService = require("./delivery.service");

/**
 * GET /api/deliveries
 *
 * Recuperer la liste des livraisons.
 * Supporte les filtres : ?status=en_route&assignment_id=1
 */
async function getDeliveries(req, res, next) {
    try {
        const filters = req.query;

        const deliveries = await deliveryService.getAllDeliveries(filters);

        res.json({
            success: true,
            data: deliveries
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/deliveries/:id
 *
 * Recuperer une livraison par son ID.
 */
async function getDeliveryById(req, res, next) {
    try {
        const { id } = req.params;

        const delivery = await deliveryService.getDeliveryById(id);

        res.json({
            success: true,
            data: delivery
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/deliveries/active/:driverId
 *
 * Recuperer la livraison active d'un chauffeur.
 */
async function getActiveDeliveryByDriver(req, res, next) {
    try {
        const { driverId } = req.params;

        const delivery = await deliveryService.getActiveDeliveryByDriver(driverId);

        res.json({
            success: true,
            data: delivery || null
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/deliveries
 *
 * Creer une nouvelle livraison.
 */
async function createDelivery(req, res, next) {
    try {
        const deliveryData = req.body;

        const delivery = await deliveryService.createDelivery(deliveryData);

        res.status(201).json({
            success: true,
            message: "Livraison creee avec succes",
            data: delivery
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/deliveries/:id
 *
 * Modifier une livraison existante.
 */
async function updateDelivery(req, res, next) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const delivery = await deliveryService.updateDelivery(id, updates);

        res.json({
            success: true,
            message: "Livraison modifiee avec succes",
            data: delivery
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/deliveries/:id/complete
 *
 * Marquer une livraison comme terminee.
 */
async function completeDelivery(req, res, next) {
    try {
        const { id } = req.params;

        const delivery = await deliveryService.completeDelivery(id);

        res.json({
            success: true,
            message: "Livraison terminee avec succes",
            data: delivery
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/deliveries/:id
 *
 * Supprimer une livraison.
 */
async function deleteDelivery(req, res, next) {
    try {
        const { id } = req.params;

        await deliveryService.deleteDelivery(id);

        res.json({
            success: true,
            message: "Livraison supprimee avec succes"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getDeliveries,
    getDeliveryById,
    getActiveDeliveryByDriver,
    createDelivery,
    updateDelivery,
    completeDelivery,
    deleteDelivery
};

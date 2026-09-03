const deliveryModel = require("./delivery.model");

/**
 * Recuperer toutes les livraisons avec filtres.
 *
 * @param {Object} filters - Filtres optionnels
 * @returns {Array} Liste des livraisons
 */
async function getAllDeliveries(filters) {
    return await deliveryModel.findDeliveries(filters);
}

/**
 * Recuperer une livraison par son ID.
 *
 * @param {number} id - L'ID de la livraison
 * @returns {Object} La livraison
 * @throws {AppError} Si la livraison n'existe pas
 */
async function getDeliveryById(id) {
    const delivery = await deliveryModel.findDeliveryById(id);

    if (!delivery) {
        const error = new Error("Livraison introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return delivery;
}

/**
 * Recuperer la livraison active d'un chauffeur.
 *
 * @param {number} driverId - L'ID du chauffeur
 * @returns {Object|null} La livraison active ou null
 */
async function getActiveDeliveryByDriver(driverId) {
    return await deliveryModel.findActiveDeliveryByDriver(driverId);
}

/**
 * Creer une nouvelle livraison.
 *
 * LOGIQUE :
 * 1. Verifier que l'assignation n'a pas deja une livraison active
 * 2. Creer la livraison
 *
 * @param {Object} deliveryData - { assignment_id }
 * @returns {Object} La livraison creee
 * @throws {AppError} Si une livraison existe deja pour cette assignation
 */
async function createDelivery(deliveryData) {
    const { assignment_id } = deliveryData;

    const existingDeliveries = await deliveryModel.findDeliveries({ assignment_id });

    if (existingDeliveries.length > 0) {
        const error = new Error("Une livraison existe deja pour cette assignation");
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
    }

    return await deliveryModel.createDelivery(deliveryData);
}

/**
 * Modifier une livraison.
 *
 * @param {number} id - L'ID de la livraison
 * @param {Object} updates - Les champs a modifier
 * @returns {Object} La livraison modifiee
 * @throws {AppError} Si la livraison n'existe pas
 */
async function updateDelivery(id, updates) {
    const delivery = await deliveryModel.findDeliveryById(id);

    if (!delivery) {
        const error = new Error("Livraison introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return await deliveryModel.updateDelivery(id, updates);
}

/**
 * Marquer une livraison comme terminee.
 *
 * LOGIQUE :
 * 1. Verifier que la livraison existe
 * 2. Verifier qu'elle n'est pas deja terminee
 * 3. Marquer comme terminee
 *
 * @param {number} id - L'ID de la livraison
 * @returns {Object} La livraison terminee
 * @throws {AppError} Si la livraison n'existe pas ou est deja terminee
 */
async function completeDelivery(id) {
    const delivery = await deliveryModel.findDeliveryById(id);

    if (!delivery) {
        const error = new Error("Livraison introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    if (delivery.status === "delivered") {
        const error = new Error("Cette livraison est deja terminee");
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
    }

    const updated = await deliveryModel.completeDelivery(id);

    if (!updated) {
        const error = new Error("Impossible de marquer la livraison comme terminee");
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
    }

    return updated;
}

/**
 * Supprimer une livraison.
 *
 * @param {number} id - L'ID de la livraison
 * @returns {boolean} true si supprimee
 * @throws {AppError} Si la livraison n'existe pas
 */
async function deleteDelivery(id) {
    const delivery = await deliveryModel.findDeliveryById(id);

    if (!delivery) {
        const error = new Error("Livraison introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return await deliveryModel.deleteDelivery(id);
}

module.exports = {
    getAllDeliveries,
    getDeliveryById,
    getActiveDeliveryByDriver,
    createDelivery,
    updateDelivery,
    completeDelivery,
    deleteDelivery
};

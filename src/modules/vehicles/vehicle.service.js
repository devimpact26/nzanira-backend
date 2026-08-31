 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

 // =====================================================================
// vehicle.service.js
// -----------------------------------------------------------------
// ROLE : Contient la logique metier (les regles de l'application).
//
// POURQUOI ?
// - Le controller gere le HTTP (req/res), pas la logique.
// - Le model fait juste du SQL, pas de logique non plus.
// - Le service est le "cerveau" : il decide QUOI faire avec les donnees.
//
// EXEMPLES DE LOGIQUE :
// - "Un chauffeur ne peut pas avoir 2 vehicules avec la meme plaque"
// - "Un vehicule ne peut pas etre supprime s'il est en livraison"
// - "Verifier que le chauffeur existe avant de creer un vehicule"
//
// COMMENT CA MARCHE ?
// - Le controller appelle le service
// - Le service verifie les regles
// - Le service appelle le model si tout est OK
// - Le service renvoie le resultat au controller
//
// REGLES :
// - NE JAMAIS utiliser req ou res ici (c'est au controller de gerer ca)
// - NE JAMAIS faire de SQL ici (c'est au model de gerer ca)
// - Ici, on fait que la logique pure
// =====================================================================

const vehicleModel = require("./vehicle.model");

// =====================================================================
// VEHICULES
// =====================================================================

/**
 * Recuperer tous les vehicules avec filtres.
 *
 * LOGIQUE : Pas de regle speciale, on delegue au model.
 * (On pourrait ajouter une pagination ici plus tard)
 *
 * @param {Object} filters - Filtres optionnels
 * @returns {Array} Liste des vehicules
 */
async function getAllVehicles(filters) {
    // On passe les filtres directement au model
    return await vehicleModel.findVehicles(filters);
}

/**
 * Recuperer un vehicule par son ID.
 *
 * LOGIQUE : Si le vehicule n'existe pas, on lance une erreur.
 * Le controller attrapera cette erreur et renverra un 404.
 *
 * @param {number} id - L'ID du vehicule
 * @returns {Object} Le vehicule
 * @throws {AppError} Si le vehicule n'existe pas
 */
async function getVehicleById(id) {
    const vehicle = await vehicleModel.findVehicleById(id);

    // Si aucun vehicule trouve, on lance une erreur
    // Cette erreur sera_attrapee par le controller dans le bloc catch
    if (!vehicle) {
        const error = new Error("Vehicule introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return vehicle;
}

/**
 * Recuperer les vehicules d'un chauffeur.
 *
 * LOGIQUE : On verifie que le chauffeur a des vehicules.
 * (On pourrait aussi verifier que le chauffeur existe)
 *
 * @param {number} driverId - L'ID du chauffeur
 * @returns {Array} Liste des vehicules du chauffeur
 */
async function getVehiclesByDriver(driverId) {
    return await vehicleModel.findVehiclesByDriver(driverId);
}

/**
 * Creer un nouveau vehicule.
 *
 * LOGIQUE :
 * 1. Verifier que la plaque n'est pas deja utilisee
 * 2. Creer le vehicule
 * 3. Renvoyer le vehicule cree
 *
 * @param {Object} vehicleData - { driver_id, category_id, plate }
 * @returns {Object} Le vehicule cree
 * @throws {AppError} Si la plaque est deja utilisee
 */
async function createVehicle(vehicleData) {
    const { plate } = vehicleData;

    // VERIFICATION : La plaque doit etre unique
    // On cherche un vehicule avec cette plaque
    const existingVehicles = await vehicleModel.findVehicles({ plate });

    if (existingVehicles.length > 0) {
        const error = new Error("Cette plaque est deja utilisee par un autre vehicule");
        error.statusCode = 409; // 409 = Conflict
        error.isOperational = true;
        throw error;
    }

    // Tout est OK, on cree le vehicule
    return await vehicleModel.createVehicle(vehicleData);
}

/**
 * Modifier un vehicule.
 *
 * LOGIQUE :
 * 1. Verifier que le vehicule existe
 * 2. Si la plaque change, verifier qu'elle n'est pas deja utilisee
 * 3. Appliquer les modifications
 *
 * @param {number} id - L'ID du vehicule
 * @param {Object} updates - Les champs a modifier
 * @returns {Object} Le vehicule modifie
 * @throws {AppError} Si le vehicule n'existe pas ou si la plaque est prise
 */
async function updateVehicle(id, updates) {
    // VERIFICATION 1 : Le vehicule doit exister
    const vehicle = await vehicleModel.findVehicleById(id);

    if (!vehicle) {
        const error = new Error("Vehicule introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    // VERIFICATION 2 : Si on change la plaque, elle doit etre unique
    if (updates.plate && updates.plate !== vehicle.plate) {
        const existingVehicles = await vehicleModel.findVehicles({ plate: updates.plate });

        if (existingVehicles.length > 0) {
            const error = new Error("Cette plaque est deja utilisee");
            error.statusCode = 409;
            error.isOperational = true;
            throw error;
        }
    }

    // Tout est OK, on applique les modifications
    return await vehicleModel.updateVehicle(id, updates);
}

/**
 * Supprimer un vehicule.
 *
 * LOGIQUE :
 * 1. Verifier que le vehicule existe
 * 2. (Plus tard) Verifier qu'il n'est pas en cours de livraison
 * 3. Supprimer
 *
 * @param {number} id - L'ID du vehicule
 * @returns {boolean} true si supprime
 * @throws {AppError} Si le vehicule n'existe pas
 */
async function deleteVehicle(id) {
    // VERIFICATION : Le vehicule doit exister
    const vehicle = await vehicleModel.findVehicleById(id);

    if (!vehicle) {
        const error = new Error("Vehicule introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    // (Plus tard) : Verifier qu'il n'est pas en cours de livraison
    // const delivery = await deliveryModel.findActiveByVehicle(id);
    // if (delivery) { throw error }

    return await vehicleModel.deleteVehicle(id);
}

// =====================================================================
// CATEGORIES
// =====================================================================

async function getAllCategories() {
    return await vehicleModel.findCategories();
}

async function getCategoryById(id) {
    const category = await vehicleModel.findCategoryById(id);

    if (!category) {
        const error = new Error("Categorie introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return category;
}

async function createCategory(categoryData) {
    return await vehicleModel.createCategory(categoryData);
}

async function updateCategory(id, updates) {
    const category = await vehicleModel.findCategoryById(id);

    if (!category) {
        const error = new Error("Categorie introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return await vehicleModel.updateCategory(id, updates);
}

async function deleteCategory(id) {
    const category = await vehicleModel.findCategoryById(id);

    if (!category) {
        const error = new Error("Categorie introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return await vehicleModel.deleteCategory(id);
}

// =====================================================================
// EXPORT
// =====================================================================
module.exports = {
    getAllVehicles,
    getVehicleById,
    getVehiclesByDriver,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

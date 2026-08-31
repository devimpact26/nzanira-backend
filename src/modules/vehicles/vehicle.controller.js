 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

 // =====================================================================
// vehicle.controller.js
// -----------------------------------------------------------------
// ROLE : Recevoir les requetes HTTP et renvoyer les reponses.
//
// POURQUOI ?
// - C'est le "pont" entre le client (mobile) et le service.
// - Il gere req et res (les objets Express).
// - Il ne fait PAS de logique metier, il delegue au service.
//
// COMMENT CA MARCHE ?
// - Le client envoie une requete (GET, POST, PUT, DELETE)
// - Express appelle la bonne fonction du controller
// - Le controller appelle le service
// - Le service fait la logique et renvoie le resultat
// - Le controller formate la reponse JSON et l'envoie au client
//
// REGLES :
// - NE JAMAIS faire de SQL ici (c'est au model de gerer ca)
// - NE JAMAIS mettre de logique metier ici (c'est au service)
// - Ici, on fait que : recevoir req, appeler le service, envoyer res
// - En cas d'erreur, on appelle next(error) pour le middleware global
// =====================================================================

const vehicleService = require("./vehicle.service");

// =====================================================================
// VEHICULES
// =====================================================================

/**
 * GET /api/vehicles
 *
 * Recuperer la liste des vehicules.
 * Supporte les filtres : ?driver_id=1&category_id=2&is_available=1
 *
 * FLOW :
 * 1. Extraire les filtres de req.query
 * 2. Appeler le service
 * 3. Renvoyer les resultats en JSON
 */
async function getVehicles(req, res, next) {
    try {
        // On passe les query parameters comme filtres
        // req.query = { driver_id: "1", is_available: "1" }
        const filters = req.query;

        const vehicles = await vehicleService.getAllVehicles(filters);

        // Reponse standardisee : { success: true, data: [...] }
        res.json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        // Si une erreur survient, on la passe au middleware global
        // NE PAS faire res.status(500).json() ici
        next(error);
    }
}

/**
 * GET /api/vehicles/:id
 *
 * Recuperer un vehicule par son ID.
 *
 * FLOW :
 * 1. Extraire l'ID de req.params
 * 2. Appeler le service
 * 3. Si pas trouve → 404
 * 4. Si trouve → renvoyer en JSON
 */
async function getVehicleById(req, res, next) {
    try {
        // req.params.id est toujours une string, on convertit en nombre
        const { id } = req.params;

        const vehicle = await vehicleService.getVehicleById(id);

        res.json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/vehicles/driver/:driverId
 *
 * Recuperer tous les vehicules d'un chauffeur.
 */
async function getVehiclesByDriver(req, res, next) {
    try {
        const { driverId } = req.params;

        const vehicles = await vehicleService.getVehiclesByDriver(driverId);

        res.json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/vehicles
 *
 * Creer un nouveau vehicule.
 *
 * FLOW :
 * 1. Les donnees sont dans req.body (deja validees par le validator)
 * 2. Appeler le service pour creer
 * 3. Si erreur (plaque deja utilisee) → 409
 * 4. Si succes → 201 Created
 */
async function createVehicle(req, res, next) {
    try {
        // req.body contient les donnees du client
        // Ex: { driver_id: 1, category_id: 2, plate: "A 123 BC" }
        const vehicleData = req.body;

        const vehicle = await vehicleService.createVehicle(vehicleData);

        // 201 = "Created" en HTTP
        res.status(201).json({
            success: true,
            message: "Vehicule cree avec succes",
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/vehicles/:id
 *
 * Modifier un vehicule existant.
 */
async function updateVehicle(req, res, next) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const vehicle = await vehicleService.updateVehicle(id, updates);

        res.json({
            success: true,
            message: "Vehicule modifie avec succes",
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/vehicles/:id
 *
 * Supprimer un vehicule.
 */
async function deleteVehicle(req, res, next) {
    try {
        const { id } = req.params;

        await vehicleService.deleteVehicle(id);

        // 200 avec message (pas de body de donnees)
        res.json({
            success: true,
            message: "Vehicule supprime avec succes"
        });
    } catch (error) {
        next(error);
    }
}

// =====================================================================
// CATEGORIES
// =====================================================================

async function getCategories(req, res, next) {
    try {
        const categories = await vehicleService.getAllCategories();

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
}

async function getCategoryById(req, res, next) {
    try {
        const { id } = req.params;

        const category = await vehicleService.getCategoryById(id);

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
}

async function createCategory(req, res, next) {
    try {
        const categoryData = req.body;

        const category = await vehicleService.createCategory(categoryData);

        res.status(201).json({
            success: true,
            message: "Categorie creee avec succes",
            data: category
        });
    } catch (error) {
        next(error);
    }
}

async function updateCategory(req, res, next) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const category = await vehicleService.updateCategory(id, updates);

        res.json({
            success: true,
            message: "Categorie modifiee avec succes",
            data: category
        });
    } catch (error) {
        next(error);
    }
}

async function deleteCategory(req, res, next) {
    try {
        const { id } = req.params;

        await vehicleService.deleteCategory(id);

        res.json({
            success: true,
            message: "Categorie supprimee avec succes"
        });
    } catch (error) {
        next(error);
    }
}

// =====================================================================
// EXPORT : on exporte toutes les fonctions du controller
// =====================================================================
module.exports = {
    // Vehicules
    getVehicles,
    getVehicleById,
    getVehiclesByDriver,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    // Categories
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

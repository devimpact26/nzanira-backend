 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

 // =====================================================================
// vehicle.routes.js
// -----------------------------------------------------------------
// ROLE : Definit les routes HTTP et les connecte aux controllers.
//
// POURQUOI ?
// - C'est le "plan" de l'API : chaque URL est mappee a une fonction.
// - Le client envoie GET /api/vehicles → Express appelle getVehicles
// - On ajoute les middlewares de validation et d'authentification ici
//
// COMMENT CA MARCHE ?
// - On cree un router Express
// - Pour chaque URL, on definit : methode → [middlewares] → controller
// - L'ordre des middlewares compte !
//
// ORDRE TYPIQUE :
//   router.get("/",
//       [optionnel] authenticate,    // 1. Verifier le token JWT
//       [optionnel] authorize,       // 2. Verifier le role
//       [optionnel] validate,        // 3. Valider les donnees
//       controller.fonction          // 4. Traiter la requete
//   );
// =====================================================================

const express = require("express");
const router = express.Router();

// Import du controller (pour appeler les fonctions de traitement)
const vehicleController = require("./vehicle.controller");

// Import des validateurs (pour valider les donnees entrantes)
const {
    validate,
    createVehicleSchema,
    updateVehicleSchema,
    queryVehicleSchema,
    createCategorySchema,
    updateCategorySchema
} = require("./vehicle.validator");

// Middlewares d'authentification (JWT) et de controle de role
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/role.middleware");

// =====================================================================
// ROUTES POUR LES CATEGORIES DE VEHICULES
// =====================================================================

// GET /api/vehicle-categories
// Recuperer toutes les categories
// Pas de validation speciale : pas de body, pas de filtres complexes
router.get("/vehicle-categories", authenticate, vehicleController.getCategories);

// GET /api/vehicle-categories/:id
// Recuperer une categorie par son ID
// Le :id est un parametre dynamique (req.params.id)
router.get("/vehicle-categories/:id", authenticate, vehicleController.getCategoryById);

// POST /api/vehicle-categories
// Creer une categorie (admin seulement)
// validate(createCategorySchema) verifie le body AVANT le controller
// SANS cette validation, un body vide provoquait "capacity_min cannot be null" (500)
router.post("/vehicle-categories",
    authenticate,
    validate(createCategorySchema),
    vehicleController.createCategory
);

// PUT /api/vehicle-categories/:id
// Modifier une categorie
router.put("/vehicle-categories/:id",
    authenticate,
    validate(updateCategorySchema),
    vehicleController.updateCategory
);

// DELETE /api/vehicle-categories/:id
// Supprimer une categorie
router.delete("/vehicle-categories/:id", authenticate, vehicleController.deleteCategory);

// =====================================================================
// ROUTES POUR LES VEHICULES
// =====================================================================

// GET /api/vehicles
// Recuperer la liste des vehicules avec filtres optionnels
// ?driver_id=1&category_id=2&is_available=1
// validate(queryVehicleSchema, "query") verifie les query parameters
router.get("/vehicles",
    authenticate,
    validate(queryVehicleSchema, "query"),
    vehicleController.getVehicles
);

// GET /api/vehicles/driver/:driverId
// Recuperer les vehicules d'un chauffeur
// IMPORTANT : Cette route doit etre AVANT /vehicles/:id
// Sinon Express interpreterait "driver" comme un :id
router.get("/vehicles/driver/:driverId", authenticate, vehicleController.getVehiclesByDriver);

// GET /api/vehicles/:id
// Recuperer un vehicule par son ID
router.get("/vehicles/:id", authenticate, vehicleController.getVehicleById);

// POST /api/vehicles
// Creer un vehicule (chauffeur seulement)
// validate(createVehicleSchema) verifie le body AVANT le controller
router.post("/vehicles",
    authenticate,
    authorize("chauffeur"),
    validate(createVehicleSchema),
    vehicleController.createVehicle
);

// PUT /api/vehicles/:id
// Modifier un vehicule — seul le proprietaire du vehicule ou un admin
// validate(updateVehicleSchema) verifie le body AVANT le controller
router.put("/vehicles/:id",
    authenticate,
    authorize("chauffeur"),
    validate(updateVehicleSchema),
    vehicleController.updateVehicle
);

// DELETE /api/vehicles/:id
// Supprimer un vehicule — seul le proprietaire du vehicule ou un admin
router.delete("/vehicles/:id",
    authenticate,
    authorize("chauffeur"),
    vehicleController.deleteVehicle
);

// =====================================================================
// EXPORT : on exporte le router pour le monter dans routes/index.js
// =====================================================================
module.exports = router;

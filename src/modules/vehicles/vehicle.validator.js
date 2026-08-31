 /* 
 * Développeur : DUSHIME PAUL
 * Email       : dushimapaul@gmail.com
 * Module      : Auth & Vehicles
 */

 // =====================================================================
// vehicle.validator.js
// -----------------------------------------------------------------
// ROLE : Valider les donnees AVANT qu'elles n'arrivent au controller.
//
// POURQUOI ?
// - On ne fait jamais confiance aux donnees du client (mobile/front).
// - Si le client envoie "abc" au lieu d'un nombre, on bloque ici.
// - Ca evite les erreurs dans le service et le model.
//
// COMMENT CA MARCHE ?
// - On definit des "schemas" avec Joi (une librairie de validation).
// - Chaque schema correspond a un type de requete (GET, POST, PUT).
// - La validation est appelee dans les routes AVANT le controller.
// =====================================================================

const Joi = require("joi");

// --- Schema pour CREER un vehicule (POST /api/vehicles) ---
// On verifie que le body contient les champs obligatoires
const createVehicleSchema = Joi.object({
    // driver_id : obligatoire, doit etre un nombre entier positif
    driver_id: Joi.number().integer().positive().required()
        .messages({
            "any.required": "L'ID du chauffeur est obligatoire",
            "number.base": "Le driver_id doit etre un nombre"
        }),

    // category_id : obligatoire, doit etre un nombre entier positif
    category_id: Joi.number().integer().positive().required()
        .messages({
            "any.required": "L'ID de la categorie est obligatoire",
            "number.base": "Le category_id doit etre un nombre"
        }),

    // plate : obligatoire, entre 2 et 20 caracteres, ex: "A 123 BC"
    plate: Joi.string().min(2).max(20).required()
        .messages({
            "any.required": "La plaque est obligatoire",
            "string.min": "La plaque doit avoir au moins 2 caracteres",
            "string.max": "La plaque ne peut pas depasser 20 caracteres"
        })
});




// --- Schema pour MODIFIER un vehicule (PUT /api/vehicles/:id) ---
// Tous les champs sont optionnels (on ne modifie que ce qu'on envoie)
const updateVehicleSchema = Joi.object({
    category_id: Joi.number().integer().positive(),
    plate: Joi.string().min(2).max(20),
    is_available: Joi.number().valid(0, 1) // 0 = non disponible, 1 = disponible
}).min(1); // Au moins 1 champ doit etre fourni

// --- Schema pour les QUERY PARAMETERS (filtres GET) ---
// Ex: GET /api/vehicles?driver_id=1&category_id=2&is_available=1
const queryVehicleSchema = Joi.object({
    driver_id: Joi.number().integer().positive(),
    category_id: Joi.number().integer().positive(),
    is_available: Joi.number().valid(0, 1)
}).options({ allowUnknown: true }); // Autoriser les champs inconnus

// =====================================================================
// EXPORT : on exporte les schemas et une fonction middleware
// =====================================================================

module.exports = {

    // Schema pour la creation
    createVehicleSchema,

    // Schema pour la modification
    updateVehicleSchema,

    // Schema pour les filtres de recherche
    queryVehicleSchema,

    // --- MIDDLEWARE DE VALIDATION ---
    // Cette fonction est utilisee dans les routes :
    // router.post("/", validate(createVehicleSchema), controller.create)
    //
    // Elle prend un schema Joi et retourne un middleware Express.
    // Le middleware valide req.body (ou req.query) contre le schema.
    // Si la validation echoue, on renvoie une erreur 400 au client.
    // Si elle reussit, on passe au middleware suivant (le controller).
    validate(schema, property = "body") {
        return (req, res, next) => {
            // schema.validate() verifie les donnees
            // On valide req.body pour POST/PUT, ou req.query pour GET
            const { error } = schema.validate(req[property], { abortEarly: false });

            if (error) {
                // On extrait tous les messages d'erreur (pas juste le premier)
                const messages = error.details.map(detail => detail.message);

                return res.status(400).json({
                    success: false,
                    message: "Donnees invalides",
                    errors: messages
                });
            }

            // Pas d'erreur → on continue vers le controller
            next();
        };
    }
};

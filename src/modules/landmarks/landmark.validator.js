const Joi = require("joi");

// =====================================================================
// landmark.validator.js
// ---------------------------------------------------------------------
// Validation Joi (regle d'or #2 du projet).
// L'ancienne version utilisait `express-validator`, package qui n'est
// PAS installe dans ce projet → MODULE_NOT_FOUND au chargement.
// =====================================================================

function validate(schema, source = "body") {
    return (req, res, next) => {
        const { error } = schema.validate(req[source], { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Données invalides",
                errors: error.details.map((d) => d.message)
            });
        }
        next();
    };
}

const lat = Joi.number().min(-90).max(90).allow(null)
    .messages({ "number.min": "La latitude doit être comprise entre -90 et 90",
                "number.max": "La latitude doit être comprise entre -90 et 90" });

const lng = Joi.number().min(-180).max(180).allow(null)
    .messages({ "number.min": "La longitude doit être comprise entre -180 et 180",
                "number.max": "La longitude doit être comprise entre -180 et 180" });

// POST /api/landmarks — { name, zone, lat?, lng? }
const createSchema = Joi.object({
    name: Joi.string().min(2).max(150).required()
        .messages({ "any.required": "Le nom est requis" }),
    zone: Joi.string().min(1).max(80).required()
        .messages({ "any.required": "La zone est requise" }),
    lat: lat.optional(),
    lng: lng.optional(),
    is_active: Joi.boolean().optional()
});

// PUT /api/landmarks/:id — { name, zone, lat, lng, is_active }
const updateSchema = Joi.object({
    name: Joi.string().min(2).max(150).optional(),
    zone: Joi.string().min(1).max(80).optional(),
    lat: lat.optional(),
    lng: lng.optional(),
    is_active: Joi.boolean().optional()
}).min(1);

// GET /api/landmarks?zone=&is_active=&limit=&offset=
const querySchema = Joi.object({
    zone: Joi.string().max(80).optional(),
    is_active: Joi.alternatives()
        .try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid("0", "1", "true", "false"))
        .optional(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0)
});

// GET /api/landmarks/search?q=...
const searchQuerySchema = Joi.object({
    q: Joi.string().min(2).max(150).required()
        .messages({ "any.required": "Le paramètre q doit avoir au moins 2 caractères" })
});

// GET /api/landmarks/nearby?lat=&lng=&radius_km=&limit=
const nearbyQuerySchema = Joi.object({
    lat: Joi.number().min(-90).max(90).required()
        .messages({ "any.required": "Les paramètres lat et lng sont requis" }),
    lng: Joi.number().min(-180).max(180).required()
        .messages({ "any.required": "Les paramètres lat et lng sont requis" }),
    radius_km: Joi.number().min(0).max(500).default(5),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
    validate,
    createSchema,
    updateSchema,
    querySchema,
    searchQuerySchema,
    nearbyQuerySchema
};

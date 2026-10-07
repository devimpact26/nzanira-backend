const Joi = require("joi");

// =====================================================================
// company.validator.js
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

// POST /api/companies — { name, registry_doc? }
const createRules = Joi.object({
    name: Joi.string().min(2).max(150).required()
        .messages({ "any.required": "Le nom de la société est requis" }),
    registry_doc: Joi.string().max(255).allow("", null).optional()
});

// PUT /api/companies/:id — { name, registry_doc }
const updateRules = Joi.object({
    name: Joi.string().min(2).max(150).optional(),
    registry_doc: Joi.string().max(255).allow("", null).optional()
}).min(1);

// GET /api/companies?search=&limit=&offset=
const queryRules = Joi.object({
    search: Joi.string().max(150).optional(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
    validate,
    createRules,
    updateRules,
    queryRules
};

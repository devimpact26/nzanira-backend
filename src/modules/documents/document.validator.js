const Joi = require("joi");

// =====================================================================
// document.validator.js
// ---------------------------------------------------------------------
// Validation Joi (regle d'or #2).
// doc_type / status sont alignes sur les ENUM réels de la table.
// =====================================================================

const DOC_TYPES = ["id_card", "passport", "driver_license", "registry"];
const STATUSES = ["pending", "approved", "rejected"];

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

// POST /api/documents — multipart : { doc_type, file }
const uploadSchema = Joi.object({
    user_id: Joi.number().integer().min(1).optional(),
    doc_type: Joi.string().valid(...DOC_TYPES).required()
        .messages({ "any.required": "Le type de document est obligatoire",
                    "any.only": "doc_type doit être : id_card, passport, driver_license ou registry" })
});

// PUT /api/documents/:id/approve | /reject
const decisionSchema = Joi.object({});

// GET /api/documents?user_id=&status=&doc_type=&limit=&offset=
const querySchema = Joi.object({
    user_id: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid(...STATUSES).optional(),
    doc_type: Joi.string().valid(...DOC_TYPES).optional(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
    validate,
    uploadSchema,
    decisionSchema,
    querySchema,
    DOC_TYPES,
    STATUSES
};

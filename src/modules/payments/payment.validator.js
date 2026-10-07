const Joi = require("joi");

// =====================================================================
// payment.validator.js
// ---------------------------------------------------------------------
// Validation Joi (regle d'or #2).
// Enums conformes aux colonnes réelles de la base :
//   provider : lumicash | leo | bancobu | bcb | bank
//   type     : publish_fee | driver_fee | refund
//   status   : pending | completed | failed | cancelled
// =====================================================================

const PROVIDERS = ["lumicash", "leo", "bancobu", "bcb", "bank"];
const TYPES = ["publish_fee", "driver_fee", "refund"];
const STATUSES = ["pending", "completed", "failed", "cancelled"];

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

// POST /api/payment-methods
const createMethodSchema = Joi.object({
    user_id: Joi.number().integer().min(1).optional(),
    provider: Joi.string().valid(...PROVIDERS).required()
        .messages({ "any.only": "provider doit être : lumicash, leo, bancobu, bcb ou bank" }),
    phone: Joi.string().max(20).allow("", null).optional(),
    bank_name: Joi.string().max(80).allow("", null).optional(),
    account_number: Joi.string().max(50).allow("", null).optional(),
    is_default: Joi.boolean().optional()
});

// PUT /api/payment-methods/:id
const updateMethodSchema = Joi.object({
    provider: Joi.string().valid(...PROVIDERS).optional(),
    phone: Joi.string().max(20).allow("", null).optional(),
    bank_name: Joi.string().max(80).allow("", null).optional(),
    account_number: Joi.string().max(50).allow("", null).optional(),
    is_default: Joi.boolean().optional()
}).min(1);

// GET /api/payment-methods?user_id=&limit=&offset=
const queryMethodSchema = Joi.object({
    user_id: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0)
});

// POST /api/transactions
const createTransactionSchema = Joi.object({
    user_id: Joi.number().integer().min(1).optional(),
    request_id: Joi.number().integer().min(1).allow(null).optional(),
    method_id: Joi.number().integer().min(1).allow(null).optional(),
    type: Joi.string().valid(...TYPES).required()
        .messages({ "any.only": "type doit être : publish_fee, driver_fee ou refund" }),
    amount_fbu: Joi.number().positive().precision(2).required()
        .messages({ "any.required": "Le montant amount_fbu est obligatoire",
                    "number.positive": "Le montant doit être positif" }),
    status: Joi.string().valid(...STATUSES).optional(),
    reference: Joi.string().max(64).allow("", null).optional()
});

// PUT /api/transactions/:id/status
const updateStatusSchema = Joi.object({
    status: Joi.string().valid(...STATUSES).required()
        .messages({ "any.required": "Le statut est obligatoire" }),
    reference: Joi.string().max(64).allow("", null).optional()
});

// GET /api/transactions?user_id=&type=&status=&limit=&offset=
const queryTransactionSchema = Joi.object({
    user_id: Joi.number().integer().min(1).optional(),
    type: Joi.string().valid(...TYPES).optional(),
    status: Joi.string().valid(...STATUSES).optional(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
    validate,
    createMethodSchema,
    updateMethodSchema,
    queryMethodSchema,
    createTransactionSchema,
    updateStatusSchema,
    queryTransactionSchema
};

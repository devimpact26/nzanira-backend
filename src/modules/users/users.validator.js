const Joi = require("joi");

// create user: required minimal fields
const createUserSchema = Joi.object({
    full_name: Joi.string().min(2).max(120).required(),
    phone: Joi.string().min(8).max(20).required(),
    email: Joi.string().email().optional().allow(null, ""),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid("chauffeur", "proprietaire", "fournisseur").required(),
    lang: Joi.string().valid("fr","en","sw","rw","rn").optional(),
    theme: Joi.string().valid("dark","light").optional(),
    gps_enabled: Joi.boolean().optional(),
    is_verified: Joi.boolean().optional(),
    is_active: Joi.boolean().optional()
});

// update user: all optional, password allowed
// ATTENTION : role / is_verified / is_active sont volontairement EXCLUS.
// Spec AGENTS.md : PUT /users/:id = { full_name, email, lang, theme }.
// Sinon un utilisateur connecté pourrait se promouvoir ou s'auto-verifier.
// (is_verified a sa propre route : PUT /users/:id/verify)
const updateUserSchema = Joi.object({
    full_name: Joi.string().min(2).max(120).optional(),
    phone: Joi.string().min(8).max(20).optional(),
    email: Joi.string().email().optional().allow(null, ""),
    password: Joi.string().min(6).max(100).optional(),
    lang: Joi.string().valid("fr","en","sw","rw","rn").optional(),
    theme: Joi.string().valid("dark","light").optional(),
    gps_enabled: Joi.boolean().optional()
}).min(1);

// query params for list
// IMPORTANT : limit/offset sont obligatoires (regle d'or #9 du projet).
// Sans eux, "GET /users?limit=5" renvoyait 400 "Donnees invalides".
const queryUserSchema = Joi.object({
    role: Joi.string().valid("chauffeur", "proprietaire", "fournisseur").optional(),
    is_active: Joi.any().optional(),
    phone: Joi.string().optional(),
    full_name: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0)
});

// settings : PUT /api/users/:id/settings
const settingsSchema = Joi.object({
    gps_enabled: Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1)).optional(),
    lang: Joi.string().valid("fr","en","sw","rw","rn").optional(),
    theme: Joi.string().valid("dark","light").optional()
}).min(1);

// verification : PUT /api/users/:id/verify (admin)
// La spec envoie { is_verified: 1 } — on accepte 1, "1", true et "true"
const verifySchema = Joi.object({
    is_verified: Joi.alternatives()
        .try(Joi.boolean().valid(true), Joi.number().valid(1), Joi.string().valid("1", "true"))
        .required()
        .messages({
            "any.required": "is_verified est obligatoire",
            "any.only": "is_verified doit valoir 1 (ou true)"
        })
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    queryUserSchema,
    settingsSchema,
    verifySchema,

    validate(schema, property = "body") {
        return (req, res, next) => {
            const { error } = schema.validate(req[property], { abortEarly: false });
            if (error) {
                const messages = error.details.map(d => d.message);
                return res.status(400).json({ success: false, message: "Données invalides", errors: messages });
            }
            next();
        };
    }
};

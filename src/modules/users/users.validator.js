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
const updateUserSchema = Joi.object({
    full_name: Joi.string().min(2).max(120).optional(),
    phone: Joi.string().min(8).max(20).optional(),
    email: Joi.string().email().optional().allow(null, ""),
    password: Joi.string().min(6).max(100).optional(),
    role: Joi.string().valid("chauffeur", "proprietaire", "fournisseur").optional(),
    lang: Joi.string().valid("fr","en","sw","rw","rn").optional(),
    theme: Joi.string().valid("dark","light").optional(),
    gps_enabled: Joi.boolean().optional(),
    is_verified: Joi.boolean().optional(),
    is_active: Joi.boolean().optional()
});

// query params for list
const queryUserSchema = Joi.object({
    role: Joi.string().valid("chauffeur", "proprietaire", "fournisseur").optional(),
    is_active: Joi.any().optional(),
    phone: Joi.string().optional(),
    full_name: Joi.string().optional()
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    queryUserSchema,

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

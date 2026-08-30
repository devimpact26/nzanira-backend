// =====================================================================
// auth.validator.js
// -----------------------------------------------------------------
// Valide les donnees pour l'inscription, la connexion, etc.
// =====================================================================

const Joi = require("joi");

// --- Schema pour INSCRIPTION (POST /api/auth/register) ---
const registerSchema = Joi.object({
    // full_name : obligatoire, entre 2 et 120 caracteres
    full_name: Joi.string().min(2).max(120).required()
        .messages({
            "any.required": "Le nom complet est obligatoire",
            "string.min": "Le nom doit avoir au moins 2 caracteres",
            "string.max": "Le nom ne peut pas depasser 120 caracteres"
        }),

    // phone : obligatoire, format international (+257 ...)
    phone: Joi.string().min(8).max(20).required()
        .messages({
            "any.required": "Le numero de telephone est obligatoire",
            "string.min": "Le telephone doit avoir au moins 8 caracteres"
        }),

    // email : optionnel, doit etre un email valide si fourni
    email: Joi.string().email().optional(),

    // password : obligatoire, entre 6 et 100 caracteres
    password: Joi.string().min(6).max(100).required()
        .messages({
            "any.required": "Le mot de passe est obligatoire",
            "string.min": "Le mot de passe doit avoir au moins 6 caracteres"
        }),

    // role : obligatoire, doit etre un des 3 roles autorises
    role: Joi.string().valid("chauffeur", "proprietaire", "fournisseur").required()
        .messages({
            "any.required": "Le role est obligatoire",
            "any.only": "Le role doit etre : chauffeur, proprietaire ou fournisseur"
        })
});

// --- Schema pour CONNEXION (POST /api/auth/login) ---
const loginSchema = Joi.object({
    // phone : obligatoire
    phone: Joi.string().required()
        .messages({
            "any.required": "Le numero de telephone est obligatoire"
        }),

    // password : obligatoire
    password: Joi.string().required()
        .messages({
            "any.required": "Le mot de passe est obligatoire"
        })
});

// --- Schema pour RAFRAICHIR LE TOKEN (POST /api/auth/refresh) ---
const refreshSchema = Joi.object({
    refreshToken: Joi.string().required()
        .messages({
            "any.required": "Le refreshToken est obligatoire"
        })
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshSchema,

    // Middleware de validation
    validate(schema, property = "body") {
        return (req, res, next) => {
            const { error } = schema.validate(req[property], { abortEarly: false });

            if (error) {
                const messages = error.details.map(detail => detail.message);
                return res.status(400).json({
                    success: false,
                    message: "Donnees invalides",
                    errors: messages
                });
            }

            next();
        };
    }
};

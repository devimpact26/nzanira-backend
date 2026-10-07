/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Notifications
 */

// =====================================================================
// notification.validator.js
// ---------------------------------------------------------------------
// Valide le format des requêtes (Joi) pour les endpoints des notifications.
// =====================================================================

const Joi = require("joi");

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

// Spec : GET /api/notifications?user_id=&is_read=
// Ajout de limit/offset (regle d'or #9 du projet).
// Sans ces champs, Joi rejetait la requete avec 400 "Donnees invalides".
const getNotificationsQuerySchema = Joi.object({
    user_id: Joi.number().integer().min(1).optional(),
    is_read: Joi.alternatives()
        .try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid("0", "1", "true", "false"))
        .optional(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0)
});

// POST /api/notifications
const createNotificationSchema = Joi.object({
    user_id: Joi.number().integer().min(1).required()
        .messages({ "any.required": "L'utilisateur destinataire est obligatoire" }),
    type: Joi.string().valid(
        "new_offer", "offer_accepted", "delivery_update", "message", "payment", "system"
    ).required()
        .messages({ "any.only": "Type de notification invalide" }),
    title: Joi.string().min(1).max(150).required()
        .messages({ "any.required": "Le titre est obligatoire" }),
    body: Joi.string().max(500).allow("", null).optional()
});

module.exports = {
    validate,
    getNotificationsQuerySchema,
    createNotificationSchema
};

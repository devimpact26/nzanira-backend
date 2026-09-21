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

const getNotificationsQuerySchema = Joi.object({
    is_read: Joi.boolean().allow(null, "")
});

module.exports = {
    validate,
    getNotificationsQuerySchema
};

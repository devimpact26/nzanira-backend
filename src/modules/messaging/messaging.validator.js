/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Messaging
 */

// =====================================================================
// messaging.validator.js
// ---------------------------------------------------------------------
// Valide le format et le schéma des données d'entrée (Joi) 
// pour la création de conversations et l'envoi de messages.
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

const createConversationSchema = Joi.object({
    request_id: Joi.number().integer().min(1).allow(null),
    driver_id: Joi.number().integer().min(1).required(),
    owner_id: Joi.number().integer().min(1).required()
});

const sendMessageSchema = Joi.object({
    content: Joi.string().trim().min(1).required().messages({
        "any.required": "Le contenu du message est obligatoire",
        "string.empty": "Le message ne peut pas être vide"
    })
});

const getMessagesQuerySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0)
});

module.exports = {
    validate,
    createConversationSchema,
    sendMessageSchema,
    getMessagesQuerySchema
};

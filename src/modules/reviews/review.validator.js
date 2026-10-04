/*
 * Développeur : MUGISHA Eric
 * Module      : Reviews
 * Description : Valide le format et le schéma des données d'entrée (Joi).
 */

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

const createReviewSchema = Joi.object({
    deliveryId: Joi.number().integer().min(1),
    delivery_id: Joi.number().integer().min(1),
    requestId: Joi.number().integer().min(1),
    request_id: Joi.number().integer().min(1),
    reviewedUserId: Joi.number().integer().min(1),
    rated_id: Joi.number().integer().min(1),
    rating: Joi.number().integer().min(1).max(5),
    score: Joi.number().integer().min(1).max(5),
    comment: Joi.string().trim().max(500).allow("", null)
})
.or("deliveryId", "delivery_id", "requestId", "request_id")
.or("rating", "score")
.messages({
    "object.missing": "Une livraison ou demande ainsi qu'une note (1 à 5) sont requises"
});

const getReviewsQuerySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
    rated_id: Joi.number().integer().min(1),
    rater_id: Joi.number().integer().min(1),
    request_id: Joi.number().integer().min(1)
});

module.exports = {
    validate,
    createReviewSchema,
    getReviewsQuerySchema
};

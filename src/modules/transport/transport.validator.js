/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const Joi = require("joi");

function validate(schema, source = "body") {
    return (req, res, next) => {
        const { error } = schema.validate(req[source]);
        if (error) {
            return res.status(400).json({
                success: false,
                errors: error.details.map((d) => d.message),
            });
        }
        next();
    };
}

// ---------- transport_requests ----------

const createRequestSchema = Joi.object({
    material_id: Joi.number().integer().required(),
    pickup_landmark_id: Joi.number().integer().allow(null),
    dest_landmark_id: Joi.number().integer().allow(null),
    pickup_address: Joi.string().max(200).allow(null, ""),
    dest_address: Joi.string().max(200).allow(null, ""),
    quantity_tons: Joi.number().positive().required(),
    expires_at: Joi.date().iso().allow(null),
});

const updateRequestSchema = Joi.object({
    status: Joi.string().valid(
        "published", "accepted", "in_progress", "delivered", "cancelled", "expired"
    ),
    pickup_address: Joi.string().max(200).allow(null, ""),
    dest_address: Joi.string().max(200).allow(null, ""),
}).min(1);

// ---------- request_assignments ----------

const acceptRequestSchema = Joi.object({
    request_id: Joi.number().integer().required(),
    vehicle_id: Joi.number().integer().required(),
    // driver_id n'est PAS dans le schema : il vient de req.user.id, jamais du client
});

module.exports = {
    validate,
    createRequestSchema,
    updateRequestSchema,
    acceptRequestSchema,
};

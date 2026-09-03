const Joi = require("joi");

const DELIVERY_STATUSES = ["accepted", "loading", "en_route", "delivered"];

const createDeliverySchema = Joi.object({
    assignment_id: Joi.number().integer().positive().required()
        .messages({
            "any.required": "L'ID de l'assignation est obligatoire",
            "number.base": "Le assignment_id doit etre un nombre"
        })
});

const updateDeliverySchema = Joi.object({
    status: Joi.string().valid(...DELIVERY_STATUSES),
    progress_pct: Joi.number().integer().min(0).max(100),
    current_landmark: Joi.number().integer().positive().allow(null),
    distance_km: Joi.number().positive().allow(null),
    eta_min: Joi.number().integer().positive().allow(null)
}).min(1);

const queryDeliverySchema = Joi.object({
    status: Joi.string().valid(...DELIVERY_STATUSES),
    assignment_id: Joi.number().integer().positive()
}).options({ allowUnknown: true });

module.exports = {
    createDeliverySchema,
    updateDeliverySchema,
    queryDeliverySchema,

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

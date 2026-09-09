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

const createDriverSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    work_status: Joi.string().valid("independent", "company").default("independent"),
    company_id: Joi.number().integer().allow(null),
});

const updateDriverSchema = Joi.object({
    work_status: Joi.string().valid("independent", "company").required(),
    company_id: Joi.number().integer().allow(null),
});

const updateLocationSchema = Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    speed_kmh: Joi.number().min(0).allow(null),
});

const availableQuerySchema = Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    radius_km: Joi.number().min(0),
});

module.exports = {
    validate,
    createDriverSchema,
    updateDriverSchema,
    updateLocationSchema,
    availableQuerySchema,
};

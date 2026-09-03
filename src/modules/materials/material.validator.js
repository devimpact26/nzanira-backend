const Joi = require("joi");

const createMaterialSchema = Joi.object({
    name: Joi.string().min(1).max(80).required()
        .messages({
            "any.required": "Le nom du materiau est obligatoire",
            "string.min": "Le nom doit avoir au moins 1 caractere",
            "string.max": "Le nom ne peut pas depasser 80 caracteres"
        })
});

const updateMaterialSchema = Joi.object({
    name: Joi.string().min(1).max(80)
}).min(1);

module.exports = {
    createMaterialSchema,
    updateMaterialSchema,

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

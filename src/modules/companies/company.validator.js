const Joi = require('joi');

const updateRules = Joi.object({
  company_name:             Joi.string().max(200).optional(),
  business_registry_number: Joi.string().max(100).optional().allow('', null),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(422).json({
      success: false,
      message: 'Données invalides.',
      errors: error.details.map(e => ({ field: e.path[0], message: e.message })),
    });
  }
  next();
};

module.exports = { updateRules, validate };

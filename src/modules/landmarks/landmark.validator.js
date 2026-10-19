const Joi = require('joi');

const createRules = Joi.object({
  name:      Joi.string().max(200).required(),
  latitude:  Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  category:  Joi.string().max(100).optional().allow('', null),
  commune:   Joi.string().max(100).optional().allow('', null),
});

const updateRules = Joi.object({
  name:      Joi.string().max(200).optional(),
  latitude:  Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  category:  Joi.string().max(100).optional().allow('', null),
  commune:   Joi.string().max(100).optional().allow('', null),
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

module.exports = { createRules, updateRules, validate };

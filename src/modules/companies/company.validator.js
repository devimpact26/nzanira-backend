const { body, validationResult } = require('express-validator');

const updateRules = [
  body('company_name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide.').isLength({ max: 200 }),
  body('business_registry_number').optional().trim().isLength({ max: 100 }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Données invalides.', errors: errors.array().map(e => ({ field: e.path, message: e.msg })) });
  }
  next();
};

module.exports = { updateRules, validate };

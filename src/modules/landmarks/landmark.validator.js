const { body, validationResult } = require('express-validator');

const createRules = [
  body('name').trim().notEmpty().withMessage('Le nom est requis.').isLength({ max: 200 }),
  body('latitude').notEmpty().isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide.'),
  body('longitude').notEmpty().isFloat({ min: -180, max: 180 }).withMessage('Longitude invalide.'),
  body('category').optional().trim().isLength({ max: 100 }),
  body('commune').optional().trim().isLength({ max: 100 }),
];

const updateRules = [
  body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide.'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide.'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude invalide.'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Données invalides.', errors: errors.array().map(e => ({ field: e.path, message: e.msg })) });
  }
  next();
};

module.exports = { createRules, updateRules, validate };

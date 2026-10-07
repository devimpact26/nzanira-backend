const express    = require('express');
const router     = express.Router();
const controller = require('./company.controller');
const {
  validate,
  createRules,
  updateRules,
  queryRules
} = require('./company.validator');

// CORRECTIONS (module livré par JESSEDAVID) :
// 1. require('../../middlewares/...') → le dossier s'appelle `middleware`
// 2. authenticate declare sur CHAQUE ROUTE (pas de router.use() global :
//    ce router est monte a la racine de /api).
// 3. Ajout de POST / et DELETE /:id absents de la spec.
// 4. Paramètre renommé :/:userId → /:id (conforme AGENTS.md).
const { authenticate } = require('../../middleware/auth.middleware');

// --- Lecture ---
router.get('/',        authenticate, validate(queryRules, 'query'), controller.getAll);
router.get('/search',  authenticate, controller.search);
router.get('/:id',     authenticate, controller.getById);

// --- Ecriture (a definir AVANT /:id) ---
router.post('/',      authenticate, validate(createRules), controller.create);
router.delete('/:id', authenticate, controller.delete);
router.put('/:id',    authenticate, validate(updateRules), controller.update);

// --- Chauffeurs d'une societe (spec) ---
// Place apres /:id mais les routes statiques sont prioritaire
router.get('/:id/drivers', authenticate, controller.getDrivers);

module.exports = router;

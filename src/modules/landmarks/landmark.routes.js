const express    = require('express');
const router     = express.Router();
const controller = require('./landmark.controller');
const {
  validate,
  createSchema,
  updateSchema,
  querySchema,
  searchQuerySchema,
  nearbyQuerySchema
} = require('./landmark.validator');

// CORRECTIONS (module livré par JESSEDAVID) :
// 1. require('../../middlewares/...') → le dossier s'appelle `middleware`
// 2. `requireAdmin` n'est PAS exporte par auth.middleware.js → supprime,
//    on utilise `authenticate` (le role "admin" n'existe pas en DB).
// 3. authenticate est declare sur CHAQUE ROUTE et non via router.use()
//    global, car ce router est monte a la racine de /api.
const { authenticate } = require('../../middleware/auth.middleware');

// --- Lecture ---
router.get('/',        authenticate, validate(querySchema, 'query'), controller.getAll);
router.get('/search',  authenticate, validate(searchQuerySchema, 'query'), controller.search);
router.get('/nearby',  authenticate, validate(nearbyQuerySchema, 'query'), controller.getNearby);
router.get('/:id',     authenticate, controller.getOne);

// --- Ecriture ---
router.post('/',      authenticate, validate(createSchema), controller.create);
router.put('/:id',    authenticate, validate(updateSchema), controller.update);
router.delete('/:id', authenticate, controller.delete);

module.exports = router;

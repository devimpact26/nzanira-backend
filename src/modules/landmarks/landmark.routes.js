const express    = require('express');
const router     = express.Router();
const controller = require('./landmark.controller');
const { createRules, updateRules, validate } = require('./landmark.validator');
const { authenticate, requireAdmin } = require('../../middlewares/auth.middleware');

router.get('/',       controller.getAll);
router.get('/search', controller.search);
router.get('/nearby', controller.getNearby);
router.get('/:id',    controller.getOne);

router.post('/',      authenticate, requireAdmin, createRules, validate, controller.create);
router.put('/:id',    authenticate, requireAdmin, updateRules, validate, controller.update);
router.delete('/:id', authenticate, requireAdmin, controller.delete);

module.exports = router;

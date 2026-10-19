const express    = require('express');
const router     = express.Router();
const controller = require('./landmark.controller');
const { createRules, updateRules, validate } = require('./landmark.validator');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize }    = require('../../middleware/role.middleware');

router.get('/',       controller.getAll);
router.get('/search', controller.search);
router.get('/nearby', controller.getNearby);
router.get('/:id',    controller.getOne);

router.post('/',      authenticate, authorize('admin'), validate(createRules), controller.create);
router.put('/:id',    authenticate, authorize('admin'), validate(updateRules), controller.update);
router.delete('/:id', authenticate, authorize('admin'), controller.delete);

module.exports = router;

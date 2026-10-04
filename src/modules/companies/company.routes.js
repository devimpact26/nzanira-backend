const express    = require('express');
const router     = express.Router();
const controller = require('./company.controller');
const { updateRules, validate } = require('./company.validator');
const { authenticate } = require('../../middlewares/auth.middleware');

router.get('/',              authenticate, controller.getAll);
router.get('/search',        authenticate, controller.search);
router.get('/:userId',       authenticate, controller.getOne);
router.get('/:userId/users', authenticate, controller.getUsers);
router.put('/:userId',       authenticate, updateRules, validate, controller.update);

module.exports = router;

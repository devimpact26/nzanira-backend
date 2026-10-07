const express = require("express");
const router = express.Router();

const usersController = require("./users.controller");
const {
    validate,
    createUserSchema,
    updateUserSchema,
    queryUserSchema,
    settingsSchema,
    verifySchema
} = require("./users.validator");

// JWT auth middleware (reuse existing)
const { authenticate } = require("../../middleware/auth.middleware");

// Public: create user (registration can be in auth module; this is admin create)
router.post("/", authenticate, validate(createUserSchema), usersController.createUser);

// Protected: list, get, update, delete
router.get("/", authenticate, validate(queryUserSchema, "query"), usersController.getUsers);
router.get("/:id", authenticate, usersController.getUserById);
router.put("/:id", authenticate, validate(updateUserSchema), usersController.updateUser);

// Parametres : { gps_enabled, lang, theme }
router.put("/:id/settings", authenticate, validate(settingsSchema), usersController.updateSettings);

// Verification du compte : { is_verified: 1 } — admin uniquement
router.put("/:id/verify", authenticate, validate(verifySchema), usersController.verifyUser);

router.delete("/:id", authenticate, usersController.deleteUser);

module.exports = router;

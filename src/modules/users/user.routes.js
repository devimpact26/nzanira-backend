const express = require("express");

const router = express.Router();

const userController = require("./user.controller");

// GET tous les utilisateurs
router.get("/", userController.getUsers);

// GET un utilisateur
router.get("/:id", userController.getUserById);

// POST créer un utilisateur
router.post("/", userController.createUser);

// PUT modifier un utilisateur
// router.put("/:id", userController.updateUser);

// DELETE supprimer un utilisateur
// router.delete("/:id", userController.deleteUser);

module.exports = router;
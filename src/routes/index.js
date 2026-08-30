const express = require("express");

const router = express.Router();

// Modules
const userRoutes = require("../modules/users/user.routes");
const vehicleRoutes = require("../modules/vehicles").vehicleRoutes;

// Montage des routes
router.use("/users", userRoutes);
router.use("/", vehicleRoutes);

module.exports = router;
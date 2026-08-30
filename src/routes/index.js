const express = require("express");

const router = express.Router();

// Modules
const vehicleRoutes = require("../modules/vehicles").vehicleRoutes;
const authRoutes = require("../modules/auth").authRoutes;

// Montage des routes
router.use("/auth", authRoutes);
router.use("/", vehicleRoutes);

module.exports = router;
const express = require("express");

const router = express.Router();

// Modules
const vehicleRoutes = require("../modules/vehicles").vehicleRoutes;
const authRoutes = require("../modules/auth").authRoutes;
const driverRoutes = require("../modules/drivers").driverRoutes;


// Montage des routes
router.use("/auth", authRoutes);
router.use("/", vehicleRoutes);
router.use("/drivers", driverRoutes);

module.exports = router;
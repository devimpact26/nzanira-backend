const express = require("express");

const router = express.Router();

// Modules
const vehicleRoutes = require("../modules/vehicles").vehicleRoutes;
const authRoutes = require("../modules/auth").authRoutes;
const driverRoutes = require("../modules/drivers").driverRoutes;
const transportRoutes = require("../modules/transport").transportRoutes;


// Montage des routes
router.use("/auth", authRoutes);
router.use("/", vehicleRoutes);
router.use("/drivers", driverRoutes);
router.use("/", transportRoutes);
    
module.exports = router;
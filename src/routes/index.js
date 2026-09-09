const express = require("express");

const router = express.Router();

// Modules
const vehicleRoutes = require("../modules/vehicles").vehicleRoutes;
const authRoutes = require("../modules/auth").authRoutes;

const materialRoutes = require("../modules/materials").materialRoutes;
const deliveryRoutes = require("../modules/deliveries").deliveryRoutes;

const driverRoutes = require("../modules/drivers").driverRoutes;
const transportRoutes = require("../modules/transport").transportRoutes;


// Montage des routes
router.use("/auth", authRoutes);
router.use("/", vehicleRoutes);

router.use("/", materialRoutes);
router.use("/", deliveryRoutes);

router.use("/drivers", driverRoutes);
router.use("/", transportRoutes);

module.exports = router;
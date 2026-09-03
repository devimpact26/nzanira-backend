const express = require("express");

const router = express.Router();

// Modules
const vehicleRoutes = require("../modules/vehicles").vehicleRoutes;
const authRoutes = require("../modules/auth").authRoutes;
const materialRoutes = require("../modules/materials").materialRoutes;
const deliveryRoutes = require("../modules/deliveries").deliveryRoutes;

// Montage des routes
router.use("/auth", authRoutes);
router.use("/", vehicleRoutes);
router.use("/", materialRoutes);
router.use("/", deliveryRoutes);

module.exports = router;
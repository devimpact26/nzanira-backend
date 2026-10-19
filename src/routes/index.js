const express = require("express");

const router = express.Router();

// Modules
const vehicleRoutes      = require("../modules/vehicles").vehicleRoutes;
const authRoutes         = require("../modules/auth").authRoutes;
const materialRoutes     = require("../modules/materials").materialRoutes;
const deliveryRoutes     = require("../modules/deliveries").deliveryRoutes;
const driverRoutes       = require("../modules/drivers").driverRoutes;
const transportRoutes    = require("../modules/transport").transportRoutes;
const userRoutes         = require("../modules/users").usersRoutes;
const messagingRoutes    = require("../modules/messaging").messagingRoutes;
const notificationRoutes = require("../modules/notifications").notificationRoutes;
const landmarkRoutes     = require("../modules/landmarks").landmarkRoutes;
const companyRoutes      = require("../modules/companies").companyRoutes;

// Montage des routes
router.use("/auth",      authRoutes);
router.use("/users",     userRoutes);

// Public routes FIRST — before any authenticate middleware
router.use("/landmarks", landmarkRoutes);
router.use("/companies", companyRoutes);

router.use("/",          vehicleRoutes);
router.use("/",          materialRoutes);
router.use("/",          deliveryRoutes);
router.use("/drivers",   driverRoutes);
router.use("/",          transportRoutes);
router.use("/",          messagingRoutes);
router.use("/",          notificationRoutes);

module.exports = router;

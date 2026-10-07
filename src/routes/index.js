const express = require("express");

const router = express.Router();

// =====================================================================
// Modules — un seul point de montage pour toute l'API.
// Regle d'or #4 : chaque module ajoute ses lignes ici.
// =====================================================================

// Modules avec un préfixe explicite
const authRoutes = require("../modules/auth").authRoutes;
const userRoutes = require("../modules/users").usersRoutes;
const driverRoutes = require("../modules/drivers").driverRoutes;
const landmarkRoutes = require("../modules/landmarks").landmarkRoutes;
const companyRoutes = require("../modules/companies").companyRoutes;

// Modules dont les routes portent déjà leur préfixe complet
// (/vehicles, /materials, /deliveries, /requests, /conversations, ...)
const vehicleRoutes = require("../modules/vehicles").vehicleRoutes;
const materialRoutes = require("../modules/materials").materialRoutes;
const deliveryRoutes = require("../modules/deliveries").deliveryRoutes;
const transportRoutes = require("../modules/transport").transportRoutes;
const messagingRoutes = require("../modules/messaging").messagingRoutes;
const notificationRoutes = require("../modules/notifications").notificationRoutes;
const reviewRoutes = require("../modules/reviews").reviewRoutes;
const paymentRoutes = require("../modules/payments").paymentRoutes;
const documentRoutes = require("../modules/documents").documentRoutes;

// --- Montage des routes ---
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/drivers", driverRoutes);
router.use("/landmarks", landmarkRoutes);
router.use("/companies", companyRoutes);

router.use("/", vehicleRoutes);
router.use("/", materialRoutes);
router.use("/", deliveryRoutes);
router.use("/", transportRoutes);
router.use("/", messagingRoutes);
router.use("/", notificationRoutes);
router.use("/", reviewRoutes);
router.use("/", paymentRoutes);
router.use("/", documentRoutes);

module.exports = router;

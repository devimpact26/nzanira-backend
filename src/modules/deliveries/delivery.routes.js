const express = require("express");
const router = express.Router();

const deliveryController = require("./delivery.controller");

const {
    validate,
    createDeliverySchema,
    updateDeliverySchema,
    queryDeliverySchema
} = require("./delivery.validator");

// JWT obligatoire : toutes les routes sauf /auth/register et /auth/login
// (regle d'or #8). Avant correction, ces routes repondaient 200 sans token.
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/role.middleware");

// GET /api/deliveries
router.get("/deliveries",
    authenticate,
    validate(queryDeliverySchema, "query"),
    deliveryController.getDeliveries
);

// GET /api/deliveries/active/:driverId
// IMPORTANT : Cette route doit etre AVANT /deliveries/:id
router.get("/deliveries/active/:driverId", authenticate, deliveryController.getActiveDeliveryByDriver);

// GET /api/deliveries/:id
router.get("/deliveries/:id", authenticate, deliveryController.getDeliveryById);

// POST /api/deliveries — spec : chauffeur
router.post("/deliveries",
    authenticate,
    authorize("chauffeur"),
    validate(createDeliverySchema),
    deliveryController.createDelivery
);

// PUT /api/deliveries/:id — spec : chauffeur (sa livraison)
router.put("/deliveries/:id",
    authenticate,
    authorize("chauffeur"),
    validate(updateDeliverySchema),
    deliveryController.updateDelivery
);

// PUT /api/deliveries/:id/complete — spec : chauffeur
router.put("/deliveries/:id/complete", authenticate, authorize("chauffeur"), deliveryController.completeDelivery);

// DELETE /api/deliveries/:id
router.delete("/deliveries/:id", authenticate, authorize("chauffeur"), deliveryController.deleteDelivery);

module.exports = router;

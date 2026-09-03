const express = require("express");
const router = express.Router();

const deliveryController = require("./delivery.controller");

const {
    validate,
    createDeliverySchema,
    updateDeliverySchema,
    queryDeliverySchema
} = require("./delivery.validator");

// GET /api/deliveries
router.get("/deliveries",
    validate(queryDeliverySchema, "query"),
    deliveryController.getDeliveries
);

// GET /api/deliveries/active/:driverId
// IMPORTANT : Cette route doit etre AVANT /deliveries/:id
router.get("/deliveries/active/:driverId", deliveryController.getActiveDeliveryByDriver);

// GET /api/deliveries/:id
router.get("/deliveries/:id", deliveryController.getDeliveryById);

// POST /api/deliveries
router.post("/deliveries",
    validate(createDeliverySchema),
    deliveryController.createDelivery
);

// PUT /api/deliveries/:id
router.put("/deliveries/:id",
    validate(updateDeliverySchema),
    deliveryController.updateDelivery
);

// PUT /api/deliveries/:id/complete
router.put("/deliveries/:id/complete", deliveryController.completeDelivery);

// DELETE /api/deliveries/:id
router.delete("/deliveries/:id", deliveryController.deleteDelivery);

module.exports = router;

const express = require("express");
const router = express.Router();

const paymentController = require("./payment.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const {
    validate,
    createMethodSchema,
    updateMethodSchema,
    queryMethodSchema,
    createTransactionSchema,
    updateStatusSchema,
    queryTransactionSchema
} = require("./payment.validator");

// =====================================================================
// Module 12 : Payments — payment_methods + transactions
// Toutes les routes sont protégées par JWT (regle d'or #8).
// =====================================================================

// --- payment-methods ---
router.get("/payment-methods",
    authenticate,
    validate(queryMethodSchema, "query"),
    paymentController.getMethods
);
router.get("/payment-methods/:id", authenticate, paymentController.getMethodById);
router.post("/payment-methods",
    authenticate,
    validate(createMethodSchema),
    paymentController.createMethod
);
router.put("/payment-methods/:id",
    authenticate,
    validate(updateMethodSchema),
    paymentController.updateMethod
);
router.put("/payment-methods/:id/default",
    authenticate,
    paymentController.setDefaultMethod
);
router.delete("/payment-methods/:id", authenticate, paymentController.deleteMethod);

// --- transactions ---
router.get("/transactions",
    authenticate,
    validate(queryTransactionSchema, "query"),
    paymentController.getTransactions
);
router.get("/transactions/:id", authenticate, paymentController.getTransactionById);
router.post("/transactions",
    authenticate,
    validate(createTransactionSchema),
    paymentController.createTransaction
);
router.put("/transactions/:id/status",
    authenticate,
    validate(updateStatusSchema),
    paymentController.updateTransactionStatus
);

module.exports = router;

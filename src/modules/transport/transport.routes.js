/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const express = require("express");
const router = express.Router();

const transportController = require("./transport.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/role.middleware");
const {
    validate,
    createRequestSchema,
    updateRequestSchema,
    acceptRequestSchema,
} = require("./transport.validator");

// ---------- transport_requests ----------

router.get("/requests", authenticate, transportController.getRequests);

router.get("/requests/:id", authenticate, transportController.getRequestById);

router.post(
    "/requests",
    authenticate,
    authorize("proprietaire", "fournisseur"),
    validate(createRequestSchema),
    transportController.createRequest
);

router.put(
    "/requests/:id",
    authenticate,
    authorize("proprietaire", "fournisseur"),
    validate(updateRequestSchema),
    transportController.updateRequest
);

router.put(
    "/requests/:id/cancel",
    authenticate,
    authorize("proprietaire", "fournisseur"),
    transportController.cancelRequest
);

router.delete(
    "/requests/:id",
    authenticate,
    authorize("proprietaire", "fournisseur"),
    transportController.deleteRequest
);

// ---------- request_assignments ----------

router.get("/assignments", authenticate, transportController.getAssignments);

router.get("/assignments/:id", authenticate, transportController.getAssignmentById);

router.post(
    "/assignments",
    authenticate,
    authorize("chauffeur"),
    validate(acceptRequestSchema),
    transportController.acceptRequest
);

module.exports = router;

/*
 * Développeur : Funny Chryssie Irishura
 * Email       : chryssiebairi@gmail.com
 * Module      : Drivers & Transport
 */

const express = require("express");
const router = express.Router();

const driverController = require("./driver.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/role.middleware");
const {
    validate,
    createDriverSchema,
    updateDriverSchema,
    updateLocationSchema,
    availableQuerySchema,
} = require("./driver.validator");

// Un chauffeur ne peut agir que sur son propre profil (req.params.id === son user id)
function isSelf(req, res, next) {
    if (String(req.user.id) !== String(req.params.id)) {
        return res.status(403).json({
            success: false,
            message: "Vous ne pouvez modifier que votre propre profil",
        });
    }
    next();
}

// Routes "fixes" AVANT les routes avec :id, sinon Express confond
// "available" avec une valeur de :id
router.get(
    "/available",
    authenticate,
    authorize("proprietaire"),
    validate(availableQuerySchema, "query"),
    driverController.getAvailable
);

router.get("/", authenticate, driverController.getDrivers);

router.get("/:id", authenticate, driverController.getDriverById);

router.get(
    "/:id/full",
    authenticate,
    authorize("proprietaire"),
    driverController.getDriverFull
);

router.get(
    "/:id/location",
    authenticate,
    authorize("proprietaire"),
    driverController.getLocation
);

router.post(
    "/",
    authenticate,
    authorize("chauffeur"),
    validate(createDriverSchema),
    driverController.createDriver
);

router.put(
    "/:id",
    authenticate,
    authorize("chauffeur"),
    isSelf,
    validate(updateDriverSchema),
    driverController.updateDriver
);

router.put(
    "/:id/location",
    authenticate,
    authorize("chauffeur"),
    isSelf,
    validate(updateLocationSchema),
    driverController.updateLocation
);

router.delete(
    "/:id",
    authenticate,
    authorize("chauffeur"),
    isSelf,
    driverController.deleteDriver
);

module.exports = router;

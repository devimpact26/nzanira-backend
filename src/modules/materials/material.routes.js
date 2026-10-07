const express = require("express");
const router = express.Router();

const materialController = require("./material.controller");

const {
    validate,
    createMaterialSchema,
    updateMaterialSchema
} = require("./material.validator");

// JWT obligatoire : toutes les routes sauf /auth/register et /auth/login
// (regle d'or #8). Avant correction, ces routes repondaient 200/201
// sans aucun token.
const { authenticate } = require("../../middleware/auth.middleware");

// GET /api/materials
router.get("/materials", authenticate, materialController.getMaterials);

// GET /api/materials/:id
router.get("/materials/:id", authenticate, materialController.getMaterialById);

// POST /api/materials
router.post("/materials",
    authenticate,
    validate(createMaterialSchema),
    materialController.createMaterial
);

// PUT /api/materials/:id
router.put("/materials/:id",
    authenticate,
    validate(updateMaterialSchema),
    materialController.updateMaterial
);

// DELETE /api/materials/:id
router.delete("/materials/:id", authenticate, materialController.deleteMaterial);

module.exports = router;

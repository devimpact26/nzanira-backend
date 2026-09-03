const express = require("express");
const router = express.Router();

const materialController = require("./material.controller");

const {
    validate,
    createMaterialSchema,
    updateMaterialSchema
} = require("./material.validator");

// GET /api/materials
router.get("/materials", materialController.getMaterials);

// GET /api/materials/:id
router.get("/materials/:id", materialController.getMaterialById);

// POST /api/materials
router.post("/materials",
    validate(createMaterialSchema),
    materialController.createMaterial
);

// PUT /api/materials/:id
router.put("/materials/:id",
    validate(updateMaterialSchema),
    materialController.updateMaterial
);

// DELETE /api/materials/:id
router.delete("/materials/:id", materialController.deleteMaterial);

module.exports = router;

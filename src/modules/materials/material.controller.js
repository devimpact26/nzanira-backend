const materialService = require("./material.service");

/**
 * GET /api/materials
 *
 * Recuperer la liste des materiaux.
 */
async function getMaterials(req, res, next) {
    try {
        const materials = await materialService.getAllMaterials();

        res.json({
            success: true,
            data: materials
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/materials/:id
 *
 * Recuperer un materiau par son ID.
 */
async function getMaterialById(req, res, next) {
    try {
        const { id } = req.params;

        const material = await materialService.getMaterialById(id);

        res.json({
            success: true,
            data: material
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/materials
 *
 * Creer un nouveau materiau.
 */
async function createMaterial(req, res, next) {
    try {
        const materialData = req.body;

        const material = await materialService.createMaterial(materialData);

        res.status(201).json({
            success: true,
            message: "Materiau cree avec succes",
            data: material
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/materials/:id
 *
 * Modifier un materiau existant.
 */
async function updateMaterial(req, res, next) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const material = await materialService.updateMaterial(id, updates);

        res.json({
            success: true,
            message: "Materiau modifie avec succes",
            data: material
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/materials/:id
 *
 * Supprimer un materiau.
 */
async function deleteMaterial(req, res, next) {
    try {
        const { id } = req.params;

        await materialService.deleteMaterial(id);

        res.json({
            success: true,
            message: "Materiau supprime avec succes"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial
};

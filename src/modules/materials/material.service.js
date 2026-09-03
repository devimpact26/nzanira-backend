const materialModel = require("./material.model");

/**
 * Recuperer tous les materiaux.
 *
 * @returns {Array} Liste des materiaux
 */
async function getAllMaterials() {
    return await materialModel.findMaterials();
}

/**
 * Recuperer un materiau par son ID.
 *
 * @param {number} id - L'ID du materiau
 * @returns {Object} Le materiau
 * @throws {AppError} Si le materiau n'existe pas
 */
async function getMaterialById(id) {
    const material = await materialModel.findMaterialById(id);

    if (!material) {
        const error = new Error("Materiau introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return material;
}

/**
 * Creer un nouveau materiau.
 *
 * LOGIQUE :
 * 1. Verifier que le nom n'est pas deja utilise
 * 2. Creer le materiau
 *
 * @param {Object} materialData - { name }
 * @returns {Object} Le materiau cree
 * @throws {AppError} Si le nom est deja utilise
 */
async function createMaterial(materialData) {
    const { name } = materialData;

    const existingMaterials = await materialModel.findMaterials();
    const duplicate = existingMaterials.find(
        m => m.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
        const error = new Error("Ce nom de materiau est deja utilise");
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
    }

    return await materialModel.createMaterial(materialData);
}

/**
 * Modifier un materiau.
 *
 * @param {number} id - L'ID du materiau
 * @param {Object} updates - Les champs a modifier
 * @returns {Object} Le materiau modifie
 * @throws {AppError} Si le materiau n'existe pas ou si le nom est pris
 */
async function updateMaterial(id, updates) {
    const material = await materialModel.findMaterialById(id);

    if (!material) {
        const error = new Error("Materiau introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    if (updates.name && updates.name !== material.name) {
        const existingMaterials = await materialModel.findMaterials();
        const duplicate = existingMaterials.find(
            m => m.name.toLowerCase() === updates.name.toLowerCase()
        );

        if (duplicate) {
            const error = new Error("Ce nom de materiau est deja utilise");
            error.statusCode = 409;
            error.isOperational = true;
            throw error;
        }
    }

    return await materialModel.updateMaterial(id, updates);
}

/**
 * Supprimer un materiau.
 *
 * @param {number} id - L'ID du materiau
 * @returns {boolean} true si supprime
 * @throws {AppError} Si le materiau n'existe pas
 */
async function deleteMaterial(id) {
    const material = await materialModel.findMaterialById(id);

    if (!material) {
        const error = new Error("Materiau introuvable");
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    return await materialModel.deleteMaterial(id);
}

module.exports = {
    getAllMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial
};

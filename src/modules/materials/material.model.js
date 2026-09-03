const { pool } = require("../../config/database");

/**
 * Recuperer TOUS les materiaux.
 *
 * @returns {Array} Liste des materiaux
 */
async function findMaterials() {
    const [rows] = await pool.query(
        "SELECT id, name FROM materials ORDER BY name"
    );
    return rows;
}

/**
 * Recuperer UN materiau par son ID.
 *
 * @param {number} id - L'ID du materiau
 * @returns {Object|undefined} Le materiau ou undefined si pas trouve
 */
async function findMaterialById(id) {
    const [rows] = await pool.query(
        "SELECT id, name FROM materials WHERE id = ?",
        [id]
    );
    return rows[0];
}

/**
 * Creer un nouveau materiau.
 *
 * @param {Object} material - { name }
 * @returns {Object} Le materiau cree avec son ID
 */
async function createMaterial(material) {
    const { name } = material;

    const [result] = await pool.query(
        "INSERT INTO materials (name) VALUES (?)",
        [name]
    );

    return {
        id: result.insertId,
        name
    };
}

/**
 * Modifier un materiau existant.
 *
 * @param {number} id - L'ID du materiau a modifier
 * @param {Object} updates - Les champs a modifier
 * @returns {Object|null} Le materiau modifie ou null si pas trouve
 */
async function updateMaterial(id, updates) {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
        }
    });

    if (fields.length === 0) return null;

    values.push(id);

    const [result] = await pool.query(
        `UPDATE materials SET ${fields.join(", ")} WHERE id = ?`,
        values
    );

    if (result.affectedRows === 0) return null;

    return await findMaterialById(id);
}

/**
 * Supprimer un materiau.
 *
 * @param {number} id - L'ID du materiau a supprimer
 * @returns {boolean} true si supprime, false si pas trouve
 */
async function deleteMaterial(id) {
    const [result] = await pool.query(
        "DELETE FROM materials WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}

module.exports = {
    findMaterials,
    findMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial
};

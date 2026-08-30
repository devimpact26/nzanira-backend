// =====================================================================
// vehicle.model.js
// -----------------------------------------------------------------
// ROLE : Communique avec la base de donnees MySQL.
//
// POURQUOI ?
// - C'est le seul fichier qui touche a la DB.
// - Si on change de DB (MySQL → PostgreSQL), on modifie ICI seulement.
// - Les autres fichiers (service, controller) n'ont jamais de SQL.
//
// COMMENT CA MARCHE ?
// - On importe le pool de connexion depuis config/database.js
// - Chaque fonction fait UN SELECT, INSERT, UPDATE ou DELETE
// - On utilise des REQUETES PARAMETREES (?) pour eviter les injections SQL
// - On retourne toujours les resultats bruts (pas de formatage)
//
// REGLES :
// - NE JAMAIS faire de `pool.query("SELECT * FROM " + table)` (injection!)
// - Toujours utiliser des placeholders : `WHERE id = ?`
// - Une fonction = une seule action SQL
// =====================================================================

const { pool } = require("../../config/database");

// =====================================================================
// VEHICULES
// =====================================================================

/**
 * Recuperer TOUS les vehicules avec filtres optionnels.
 *
 * @param {Object} filters - Filtres de recherche (optionnel)
 * @param {number} filters.driver_id - Filtrer par chauffeur
 * @param {number} filters.category_id - Filtrer par categorie
 * @param {number} filters.is_available - Filtrer par disponibilite (0 ou 1)
 * @returns {Array} Liste des vehicules avec info categorie et chauffeur
 */
async function findVehicles(filters = {}) {
    // On construit la requete dynamiquement selon les filtres
    let query = `
        SELECT
            v.id,
            v.driver_id,
            v.category_id,
            v.plate,
            v.is_available,
            v.created_at,
            c.label AS category_label,
            c.capacity_min,
            c.capacity_max
        FROM vehicles v
        LEFT JOIN vehicle_categories c ON v.category_id = c.id
        WHERE 1=1
    `;
    const params = [];

    // Si un filtre est fourni, on l'ajoute a la requete
    if (filters.driver_id) {
        query += " AND v.driver_id = ?";
        params.push(filters.driver_id);
    }

    if (filters.category_id) {
        query += " AND v.category_id = ?";
        params.push(filters.category_id);
    }

    if (filters.is_available !== undefined) {
        query += " AND v.is_available = ?";
        params.push(filters.is_available);
    }

    // Trier par date de creation (plus recent en premier)
    query += " ORDER BY v.created_at DESC";

    // On execute la requete avec les parametres
    // pool.query() retourne [rows, fields]
    const [rows] = await pool.query(query, params);

    return rows;
}

/**
 * Recuperer UN vehicule par son ID.
 *
 * @param {number} id - L'ID du vehicule
 * @returns {Object|undefined} Le vehicule ou undefined si pas trouve
 */
async function findVehicleById(id) {
    const [rows] = await pool.query(
        `
        SELECT
            v.id,
            v.driver_id,
            v.category_id,
            v.plate,
            v.is_available,
            v.created_at,
            c.label AS category_label,
            c.capacity_min,
            c.capacity_max
        FROM vehicles v
        LEFT JOIN vehicle_categories c ON v.category_id = c.id
        WHERE v.id = ?
        `,
        [id]
    );

    // rows[0] est le premier resultat (ou undefined si aucun)
    return rows[0];
}

/**
 * Recuperer tous les vehicules d'un chauffeur.
 *
 * @param {number} driverId - L'ID du chauffeur
 * @returns {Array} Liste des vehicules du chauffeur
 */
async function findVehiclesByDriver(driverId) {
    const [rows] = await pool.query(
        `
        SELECT
            v.id,
            v.driver_id,
            v.category_id,
            v.plate,
            v.is_available,
            v.created_at,
            c.label AS category_label,
            c.capacity_min,
            c.capacity_max
        FROM vehicles v
        LEFT JOIN vehicle_categories c ON v.category_id = c.id
        WHERE v.driver_id = ?
        ORDER BY v.created_at DESC
        `,
        [driverId]
    );

    return rows;
}

/**
 * Creer un nouveau vehicule.
 *
 * @param {Object} vehicle - Les donnees du vehicule
 * @param {number} vehicle.driver_id - ID du chauffeur
 * @param {number} vehicle.category_id - ID de la categorie
 * @param {string} vehicle.plate - Plaque d'immatriculation
 * @returns {Object} Le vehicule cree avec son ID
 */
async function createVehicle(vehicle) {
    const { driver_id, category_id, plate } = vehicle;

    // INSERT INTO ... VALUES (?, ?, ?) — jamais de concatenation de chaines!
    const [result] = await pool.query(
        "INSERT INTO vehicles (driver_id, category_id, plate) VALUES (?, ?, ?)",
        [driver_id, category_id, plate]
    );

    // result.insertId contient l'ID genere automatiquement
    return {
        id: result.insertId,
        driver_id,
        category_id,
        plate,
        is_available: 1 // Par defaut, le vehicule est disponible
    };
}

/**
 * Modifier un vehicule existant.
 *
 * @param {number} id - L'ID du vehicule a modifier
 * @param {Object} updates - Les champs a modifier
 * @returns {Object|null} Le vehicule modifie ou null si pas trouve
 */
async function updateVehicle(id, updates) {
    // On construit dynamiquement la clause SET
    // Ex: { plate: "B 456 CD", is_available: 0 } → "plate = ?, is_available = ?"
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
        // On ne modifie que les champs fournis
        if (updates[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
        }
    });

    if (fields.length === 0) return null;

    // On ajoute l'ID a la fin des valeurs
    values.push(id);

    const [result] = await pool.query(
        `UPDATE vehicles SET ${fields.join(", ")} WHERE id = ?`,
        values
    );

    // affectedRows indique combien de lignes ont ete modifiees
    if (result.affectedRows === 0) return null;

    // On recupere le vehicule modifie pour le renvoyer au client
    return await findVehicleById(id);
}

/**
 * Supprimer un vehicule.
 *
 * @param {number} id - L'ID du vehicule a supprimer
 * @returns {boolean} true si supprime, false si pas trouve
 */
async function deleteVehicle(id) {
    const [result] = await pool.query(
        "DELETE FROM vehicles WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
}

// =====================================================================
// CATEGORIES DE VEHICULES
// =====================================================================

/**
 * Recuperer toutes les categories.
 *
 * @returns {Array} Liste des categories
 */
async function findCategories() {
    const [rows] = await pool.query(
        "SELECT id, code, label, capacity_min, capacity_max FROM vehicle_categories ORDER BY code"
    );
    return rows;
}

/**
 * Recuperer une categorie par son ID.
 *
 * @param {number} id - L'ID de la categorie
 * @returns {Object|undefined} La categorie ou undefined
 */
async function findCategoryById(id) {
    const [rows] = await pool.query(
        "SELECT id, code, label, capacity_min, capacity_max FROM vehicle_categories WHERE id = ?",
        [id]
    );
    return rows[0];
}

/**
 * Creer une categorie.
 *
 * @param {Object} category - { code, label, capacity_min, capacity_max }
 * @returns {Object} La categorie creee
 */
async function createCategory(category) {
    const { code, label, capacity_min, capacity_max } = category;

    const [result] = await pool.query(
        "INSERT INTO vehicle_categories (code, label, capacity_min, capacity_max) VALUES (?, ?, ?, ?)",
        [code, label, capacity_min, capacity_max]
    );

    return {
        id: result.insertId,
        code,
        label,
        capacity_min,
        capacity_max
    };
}

/**
 * Modifier une categorie.
 *
 * @param {number} id - L'ID de la categorie
 * @param {Object} updates - Les champs a modifier
 * @returns {Object|null} La categorie modifiee ou null
 */
async function updateCategory(id, updates) {
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
        `UPDATE vehicle_categories SET ${fields.join(", ")} WHERE id = ?`,
        values
    );

    if (result.affectedRows === 0) return null;

    return await findCategoryById(id);
}

/**
 * Supprimer une categorie.
 *
 * @param {number} id - L'ID de la categorie
 * @returns {boolean} true si supprimee
 */
async function deleteCategory(id) {
    const [result] = await pool.query(
        "DELETE FROM vehicle_categories WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}

// =====================================================================
// EXPORT : on exporte toutes les fonctions du model
// =====================================================================
module.exports = {
    // Vehicules
    findVehicles,
    findVehicleById,
    findVehiclesByDriver,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    // Categories
    findCategories,
    findCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

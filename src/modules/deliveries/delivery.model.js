const { pool } = require("../../config/database");

/**
 * Recuperer TOUS les livraisons avec filtres optionnels.
 *
 * @param {Object} filters - Filtres de recherche (optionnel)
 * @param {string} filters.status - Filtrer par statut
 * @param {number} filters.assignment_id - Filtrer par assignation
 * @returns {Array} Liste des livraisons
 */
async function findDeliveries(filters = {}) {
    let query = `
        SELECT
            d.id,
            d.assignment_id,
            d.status,
            d.progress_pct,
            d.current_landmark,
            d.distance_km,
            d.eta_min,
            d.started_at,
            d.delivered_at,
            l.name AS landmark_name
        FROM deliveries d
        LEFT JOIN landmarks l ON d.current_landmark = l.id
        WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
        query += " AND d.status = ?";
        params.push(filters.status);
    }

    if (filters.assignment_id) {
        query += " AND d.assignment_id = ?";
        params.push(filters.assignment_id);
    }

    query += " ORDER BY d.started_at DESC";

    const [rows] = await pool.query(query, params);

    return rows;
}

/**
 * Recuperer UNE livraison par son ID.
 *
 * @param {number} id - L'ID de la livraison
 * @returns {Object|undefined} La livraison ou undefined si pas trouvee
 */
async function findDeliveryById(id) {
    const [rows] = await pool.query(
        `
        SELECT
            d.id,
            d.assignment_id,
            d.status,
            d.progress_pct,
            d.current_landmark,
            d.distance_km,
            d.eta_min,
            d.started_at,
            d.delivered_at,
            l.name AS landmark_name
        FROM deliveries d
        LEFT JOIN landmarks l ON d.current_landmark = l.id
        WHERE d.id = ?
        `,
        [id]
    );

    return rows[0];
}

/**
 * Recuperer la livraison active d'un chauffeur.
 *
 * @param {number} driverId - L'ID du chauffeur
 * @returns {Object|undefined} La livraison active ou undefined
 */
async function findActiveDeliveryByDriver(driverId) {
    const [rows] = await pool.query(
        `
        SELECT
            d.id,
            d.assignment_id,
            d.status,
            d.progress_pct,
            d.current_landmark,
            d.distance_km,
            d.eta_min,
            d.started_at,
            d.delivered_at,
            l.name AS landmark_name
        FROM deliveries d
        JOIN request_assignments ra ON d.assignment_id = ra.id
        LEFT JOIN landmarks l ON d.current_landmark = l.id
        WHERE ra.driver_id = ?
          AND d.status NOT IN ('delivered')
        ORDER BY d.started_at DESC
        LIMIT 1
        `,
        [driverId]
    );

    return rows[0];
}

/**
 * Creer une nouvelle livraison.
 *
 * @param {Object} delivery - Les donnees de la livraison
 * @param {number} delivery.assignment_id - ID de l'assignation
 * @returns {Object} La livraison creee avec son ID
 */
async function createDelivery(delivery) {
    const { assignment_id } = delivery;

    const [result] = await pool.query(
        "INSERT INTO deliveries (assignment_id) VALUES (?)",
        [assignment_id]
    );

    return {
        id: result.insertId,
        assignment_id,
        status: "accepted",
        progress_pct: 0
    };
}

/**
 * Modifier une livraison existante.
 *
 * @param {number} id - L'ID de la livraison a modifier
 * @param {Object} updates - Les champs a modifier
 * @returns {Object|null} La livraison modifiee ou null si pas trouvee
 */
async function updateDelivery(id, updates) {
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
        `UPDATE deliveries SET ${fields.join(", ")} WHERE id = ?`,
        values
    );

    if (result.affectedRows === 0) return null;

    return await findDeliveryById(id);
}

/**
 * Marquer une livraison comme terminee.
 *
 * @param {number} id - L'ID de la livraison
 * @returns {Object|null} La livraison terminee ou null si pas trouvee
 */
async function completeDelivery(id) {
    const [result] = await pool.query(
        `UPDATE deliveries SET status = 'delivered', progress_pct = 100, delivered_at = NOW() WHERE id = ? AND status != 'delivered'`,
        [id]
    );

    if (result.affectedRows === 0) return null;

    return await findDeliveryById(id);
}

/**
 * Supprimer une livraison.
 *
 * @param {number} id - L'ID de la livraison a supprimer
 * @returns {boolean} true si supprimee, false si pas trouvee
 */
async function deleteDelivery(id) {
    const [result] = await pool.query(
        "DELETE FROM deliveries WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}

module.exports = {
    findDeliveries,
    findDeliveryById,
    findActiveDeliveryByDriver,
    createDelivery,
    updateDelivery,
    completeDelivery,
    deleteDelivery
};

/*
 * Développeur : MUGISHA Eric
 * Module      : Reviews
 * Description : Accès à la base de données pour les avis et notations.
 */

const { pool } = require("../../config/database");

/**
 * Rechercher le contexte d'une livraison ou d'une demande pour vérifier
 * l'éligibilité d'un avis (livraison terminée, identification des participants).
 *
 * @param {number} identifier - L'ID de la livraison (delivery_id) ou de la demande (request_id)
 * @returns {Object|null} Les détails du transport/livraison ou null
 */
async function findDeliveryContext(identifier) {
    const [rows] = await pool.query(
        `SELECT
            tr.id AS request_id,
            d.id AS delivery_id,
            tr.status AS request_status,
            d.status AS delivery_status,
            tr.requester_id,
            ra.driver_id
         FROM transport_requests tr
         LEFT JOIN request_assignments ra ON ra.request_id = tr.id
         LEFT JOIN deliveries d ON d.assignment_id = ra.id
         WHERE d.id = ? OR tr.id = ?
         ORDER BY d.id DESC
         LIMIT 1`,
        [identifier, identifier]
    );

    return rows[0] || null;
}

/**
 * Vérifier si un avis existe déjà pour une demande, un rater et un rated.
 */
async function findExistingReview(requestId, raterId, ratedId) {
    const [rows] = await pool.query(
        `SELECT * FROM reviews
         WHERE request_id = ? AND rater_id = ? AND rated_id = ?`,
        [requestId, raterId, ratedId]
    );
    return rows[0] || null;
}

/**
 * Créer un nouvel avis.
 */
async function create({ request_id, rater_id, rated_id, score, comment }) {
    const [result] = await pool.query(
        `INSERT INTO reviews (request_id, rater_id, rated_id, score, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [request_id, rater_id, rated_id, score, comment || null]
    );

    return findById(result.insertId);
}

/**
 * Récupérer un avis par son ID avec les informations des utilisateurs.
 */
async function findById(id) {
    const [rows] = await pool.query(
        `SELECT
            r.id,
            r.request_id,
            r.rater_id,
            u1.full_name AS rater_name,
            u1.role AS rater_role,
            r.rated_id,
            u2.full_name AS rated_name,
            u2.role AS rated_role,
            r.score,
            r.comment,
            r.created_at
         FROM reviews r
         JOIN users u1 ON u1.id = r.rater_id
         JOIN users u2 ON u2.id = r.rated_id
         WHERE r.id = ?`,
        [id]
    );

    return rows[0] || null;
}

/**
 * Récupérer la liste des avis avec filtres et pagination.
 */
async function findAll(filters = {}) {
    let sql = `
        SELECT
            r.id,
            r.request_id,
            r.rater_id,
            u1.full_name AS rater_name,
            u1.role AS rater_role,
            r.rated_id,
            u2.full_name AS rated_name,
            u2.role AS rated_role,
            r.score,
            r.comment,
            r.created_at
        FROM reviews r
        JOIN users u1 ON u1.id = r.rater_id
        JOIN users u2 ON u2.id = r.rated_id
        WHERE 1=1
    `;
    const params = [];

    if (filters.rated_id) {
        sql += " AND r.rated_id = ?";
        params.push(filters.rated_id);
    }
    if (filters.rater_id) {
        sql += " AND r.rater_id = ?";
        params.push(filters.rater_id);
    }
    if (filters.request_id) {
        sql += " AND r.request_id = ?";
        params.push(filters.request_id);
    }

    sql += " ORDER BY r.created_at DESC";

    if (filters.limit) {
        const limit = parseInt(filters.limit, 10) || 20;
        const offset = parseInt(filters.offset, 10) || 0;
        sql += " LIMIT ? OFFSET ?";
        params.push(limit, offset);
    }

    const [rows] = await pool.query(sql, params);
    return rows;
}

/**
 * Calculer la moyenne et le nombre d'avis reçus par un utilisateur.
 */
async function findUserStats(userId) {
    const [rows] = await pool.query(
        `SELECT
            COUNT(*) AS totalReviews,
            COALESCE(AVG(score), 0) AS averageRating
         FROM reviews
         WHERE rated_id = ?`,
        [userId]
    );

    const stats = rows[0] || { totalReviews: 0, averageRating: 0 };
    return {
        totalReviews: Number(stats.totalReviews),
        averageRating: Math.round(Number(stats.averageRating) * 10) / 10
    };
}

/**
 * Supprimer un avis par son ID.
 */
async function remove(id) {
    const [result] = await pool.query("DELETE FROM reviews WHERE id = ?", [id]);
    return result.affectedRows > 0;
}

module.exports = {
    findDeliveryContext,
    findExistingReview,
    create,
    findById,
    findAll,
    findUserStats,
    remove
};

/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Messaging
 */

// =====================================================================
// messaging.model.js
// ---------------------------------------------------------------------
// Exécute les requêtes SQL préparées sur la base de données MySQL 
// pour les tables `conversations` et `messages`.
// Gère la récupération contextuelle, les jointures et l'historique.
// =====================================================================

const { pool } = require("../../config/database");

/**
 * Trouver une conversation par son ID.
 */
async function findConversationById(id) {
    const [rows] = await pool.query(
        `SELECT c.*, 
                tr.material_id, tr.quantity_tons, tr.status AS request_status,
                u_driver.full_name AS driver_name, u_driver.phone AS driver_phone,
                u_owner.full_name AS owner_name, u_owner.phone AS owner_phone
         FROM conversations c
         LEFT JOIN transport_requests tr ON c.request_id = tr.id
         JOIN users u_driver ON c.driver_id = u_driver.id
         JOIN users u_owner ON c.owner_id = u_owner.id
         WHERE c.id = ?`,
        [id]
    );
    return rows[0] || null;
}

/**
 * Chercher une conversation existante par context (request_id, driver_id, owner_id)
 */
async function findExistingConversation(requestId, driverId, ownerId) {
    let sql = "SELECT * FROM conversations WHERE driver_id = ? AND owner_id = ?";
    const params = [driverId, ownerId];

    if (requestId) {
        sql += " AND request_id = ?";
        params.push(requestId);
    } else {
        sql += " AND request_id IS NULL";
    }

    const [rows] = await pool.query(sql, params);
    return rows[0] || null;
}

/**
 * Creer une nouvelle conversation.
 */
async function createConversation({ request_id, driver_id, owner_id }) {
    const [result] = await pool.query(
        `INSERT INTO conversations (request_id, driver_id, owner_id)
         VALUES (?, ?, ?)`,
        [request_id || null, driver_id, owner_id]
    );
    return findConversationById(result.insertId);
}

/**
 * Recuperer les conversations d'un utilisateur (driver ou owner) avec infos du dernier message et unread count.
 */
async function findUserConversations(userId) {
    const sql = `
        SELECT c.*,
               tr.quantity_tons, tr.status AS request_status, m_mat.name AS material_name,
               u_driver.full_name AS driver_name, u_driver.phone AS driver_phone,
               u_owner.full_name AS owner_name, u_owner.phone AS owner_phone,
               lm.content AS last_message_content,
               lm.sent_at AS last_message_at,
               lm.sender_id AS last_message_sender_id,
               COALESCE(unread.unread_count, 0) AS unread_count
        FROM conversations c
        LEFT JOIN transport_requests tr ON c.request_id = tr.id
        LEFT JOIN materials m_mat ON tr.material_id = m_mat.id
        JOIN users u_driver ON c.driver_id = u_driver.id
        JOIN users u_owner ON c.owner_id = u_owner.id
        LEFT JOIN (
            SELECT m1.*
            FROM messages m1
            INNER JOIN (
                SELECT conversation_id, MAX(id) AS max_id
                FROM messages
                GROUP BY conversation_id
            ) m2 ON m1.id = m2.max_id
        ) lm ON c.id = lm.conversation_id
        LEFT JOIN (
            SELECT conversation_id, COUNT(*) AS unread_count
            FROM messages
            WHERE is_read = 0 AND sender_id != ?
            GROUP BY conversation_id
        ) unread ON c.id = unread.conversation_id
        WHERE c.driver_id = ? OR c.owner_id = ?
        ORDER BY COALESCE(lm.sent_at, c.created_at) DESC
    `;

    const [rows] = await pool.query(sql, [userId, userId, userId]);
    return rows;
}

/**
 * Ajouter un message a une conversation.
 */
async function createMessage({ conversation_id, sender_id, content }) {
    const [result] = await pool.query(
        `INSERT INTO messages (conversation_id, sender_id, content)
         VALUES (?, ?, ?)`,
        [conversation_id, sender_id, content]
    );
    return findMessageById(result.insertId);
}

/**
 * Obtenir un message par ID.
 */
async function findMessageById(id) {
    const [rows] = await pool.query(
        `SELECT m.*, u.full_name AS sender_name
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.id = ?`,
        [id]
    );
    return rows[0] || null;
}

/**
 * Obtenir les messages d'une conversation (ordre chronologique).
 */
async function findMessagesByConversation(conversationId, options = {}) {
    const limit = parseInt(options.limit, 10) || 50;
    const offset = parseInt(options.offset, 10) || 0;

    const [rows] = await pool.query(
        `SELECT m.*, u.full_name AS sender_name
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.conversation_id = ?
         ORDER BY m.sent_at ASC, m.id ASC
         LIMIT ? OFFSET ?`,
        [conversationId, limit, offset]
    );
    return rows;
}

/**
 * Marquer tous les messages d'une conversation comme lus pour un destinataire.
 */
async function markMessagesAsRead(conversationId, recipientId) {
    const [result] = await pool.query(
        `UPDATE messages
         SET is_read = 1
         WHERE conversation_id = ? AND sender_id != ? AND is_read = 0`,
        [conversationId, recipientId]
    );
    return result.affectedRows;
}

module.exports = {
    findConversationById,
    findExistingConversation,
    createConversation,
    findUserConversations,
    createMessage,
    findMessageById,
    findMessagesByConversation,
    markMessagesAsRead
};

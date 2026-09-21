/* 
 * Développeur : MUGISHA Eric
 * Email       : mugishaeric@gmail.com
 * Module      : Notifications
 */

// =====================================================================
// notification.model.js
// ---------------------------------------------------------------------
// Exécute les requêtes SQL préparées sur la table `notifications`.
// Permet la création individuelle/en masse, le filtrage et le marquage comme lu.
// =====================================================================

const { pool } = require("../../config/database");

/**
 * Creer une notification individuelle.
 */
async function createNotification({ user_id, type, title, body }) {
    const [result] = await pool.query(
        `INSERT INTO notifications (user_id, type, title, body)
         VALUES (?, ?, ?, ?)`,
        [user_id, type, title, body || null]
    );
    return findNotificationById(result.insertId);
}

/**
 * Notifier en masse tous les utilisateurs d'un certain role.
 */
async function notifyAllUsersByRole(role, { type, title, body }) {
    const [users] = await pool.query(
        "SELECT id FROM users WHERE role = ? AND is_active = 1",
        [role]
    );

    if (users.length === 0) return [];

    const values = users.map(u => [u.id, type, title, body || null]);

    await pool.query(
        `INSERT INTO notifications (user_id, type, title, body) VALUES ?`,
        [values]
    );

    return users.map(u => u.id);
}

async function findNotificationById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM notifications WHERE id = ?",
        [id]
    );
    return rows[0] || null;
}

async function findUserNotifications(userId, isRead) {
    let sql = "SELECT * FROM notifications WHERE user_id = ?";
    const params = [userId];

    if (isRead !== undefined && isRead !== null) {
        sql += " AND is_read = ?";
        params.push(isRead ? 1 : 0);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await pool.query(sql, params);
    return rows;
}

async function countUnread(userId) {
    const [rows] = await pool.query(
        "SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0",
        [userId]
    );
    return rows[0] ? rows[0].count : 0;
}

async function markAsRead(id, userId) {
    const [result] = await pool.query(
        "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
        [id, userId]
    );
    return result.affectedRows > 0;
}

async function markAllAsRead(userId) {
    const [result] = await pool.query(
        "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
        [userId]
    );
    return result.affectedRows;
}

module.exports = {
    createNotification,
    notifyAllUsersByRole,
    findNotificationById,
    findUserNotifications,
    countUnread,
    markAsRead,
    markAllAsRead
};

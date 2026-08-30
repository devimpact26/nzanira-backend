// =====================================================================
// auth.model.js
// -----------------------------------------------------------------
// Requetes SQL liees a l'authentification.
// Utilise la table users du module users pour creer/verifier les comptes.
// =====================================================================

const { pool } = require("../../config/database");

/**
 * Creer un nouvel utilisateur (inscription).
 *
 * @param {Object} user - { full_name, phone, email, password_hash, role }
 * @returns {Object} L'utilisateur cree avec son ID
 */
async function createUser(user) {
    const { full_name, phone, email, password_hash, role } = user;

    const [result] = await pool.query(
        "INSERT INTO users (full_name, phone, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
        [full_name, phone, email || null, password_hash, role]
    );

    return {
        id: result.insertId,
        full_name,
        phone,
        email: email || null,
        role
    };
}

/**
 * Chercher un utilisateur par son numero de telephone.
 *
 * @param {string} phone - Le numero de telephone
 * @returns {Object|undefined} L'utilisateur ou undefined
 */
async function findByPhone(phone) {
    const [rows] = await pool.query(
        "SELECT id, full_name, phone, email, password_hash, role, is_active FROM users WHERE phone = ?",
        [phone]
    );
    return rows[0];
}

/**
 * Chercher un utilisateur par son ID.
 *
 * @param {number} id - L'ID de l'utilisateur
 * @returns {Object|undefined} L'utilisateur (sans password_hash) ou undefined
 */
async function findById(id) {
    const [rows] = await pool.query(
        "SELECT id, full_name, phone, email, role, lang, theme, gps_enabled, is_verified, is_active, created_at FROM users WHERE id = ?",
        [id]
    );
    return rows[0];
}

module.exports = {
    createUser,
    findByPhone,
    findById
};
